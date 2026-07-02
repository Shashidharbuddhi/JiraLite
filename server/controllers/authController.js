import { validationResult } from 'express-validator';
import crypto from 'crypto';
import User, { USER_ROLES, normalizeUserRole } from '../models/User.js';
import Workspace from '../models/Workspace.js';
import PendingRegistration from '../models/PendingRegistration.js';
import generateToken from '../utils/generateToken.js';
import buildAuthUser from '../utils/authPayload.js';
import slugify from '../utils/slugify.js';
import sendEmail, { isEmailConfigured } from '../utils/sendEmail.js';
import { isGmailAddress } from '../utils/emailPolicy.js';

const createWorkspaceSlug = async (workspaceName) => {
  const baseSlug = slugify(workspaceName) || `workspace-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (await Workspace.findOne({ slug })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};

const sendAuthResponse = (res, statusCode, user, message) =>
  res.status(statusCode).json({
    success: true,
    message,
    user: buildAuthUser(user),
    token: generateToken(user)
  });

export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, workspaceName } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (!isGmailAddress(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Use a valid Gmail address to create an account'
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    let pendingRegistration = await PendingRegistration.findOne({ email: normalizedEmail });

    if (!pendingRegistration) {
      pendingRegistration = new PendingRegistration({
        name,
        email: normalizedEmail,
        password,
        workspaceName
      });
    } else {
      pendingRegistration.name = name;
      pendingRegistration.workspaceName = workspaceName;
      pendingRegistration.password = password;
    }

    const verificationToken = pendingRegistration.createVerificationToken();
    await pendingRegistration.save();

    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
    const subject = 'Verify your JiraLite Gmail address';
    const text = `Verify your JiraLite account within 30 minutes using this link: ${verificationUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #0f172a;">
        <h2>Verify your Gmail to finish creating your workspace</h2>
        <p>Your JiraLite workspace is almost ready. Confirm your Gmail address within 30 minutes.</p>
        <p><a href="${verificationUrl}">Verify Gmail and create workspace</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;

    try {
      const emailResult = await sendEmail({
        to: normalizedEmail,
        subject,
        text,
        html
      });

      return res.status(200).json({
        success: true,
        message: isEmailConfigured()
          ? 'Verification link sent to your Gmail. Verify the email to create your workspace.'
          : 'Email service is not configured, so the verification link was logged in the server terminal for local development.',
        ...(emailResult?.mode === 'console' ? { verificationUrl } : {})
      });
    } catch (emailError) {
      await PendingRegistration.findByIdAndDelete(pendingRegistration._id);
      return next(emailError);
    }
  } catch (error) {
    next(error);
  }
};

export const verifyEmailRegistration = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const pendingRegistration = await PendingRegistration.findOne({
      verificationToken: hashedToken,
      verificationExpire: { $gt: Date.now() }
    });

    if (!pendingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Verification link is invalid or has expired'
      });
    }

    const existingUser = await User.findOne({ email: pendingRegistration.email });

    if (existingUser) {
      await pendingRegistration.deleteOne();
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = new User({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
      role: USER_ROLES.WORKSPACE_ADMIN
    });

    user.$locals = {
      skipPasswordHash: true
    };

    await user.save();

    const workspace = await Workspace.create({
      name: pendingRegistration.workspaceName,
      slug: await createWorkspaceSlug(pendingRegistration.workspaceName),
      owner: user._id,
      members: [user._id]
    });

    user.workspaceId = workspace._id;
    user.emailVerified = true;
    await user.save();
    await pendingRegistration.deleteOne();

    return sendAuthResponse(res, 201, user, 'Email verified and workspace created successfully');
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const role = normalizeUserRole(user.role);

    if (role === USER_ROLES.PLATFORM_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Use the admin login portal for platform accounts'
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Verify your email before logging in'
      });
    }

    return sendAuthResponse(res, 200, user, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (normalizeUserRole(user.role) !== USER_ROLES.PLATFORM_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only platform admins can access this portal'
      });
    }

    return sendAuthResponse(res, 200, user, 'Admin login successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id)
      .select('-password')
      .populate('workspaceId', 'name slug status');

    res.status(200).json({
      success: true,
      user: {
        ...buildAuthUser(user),
        workspace: user.workspaceId || null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists for that email, a reset link has been sent.'
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const subject = 'Reset your JiraLite password';
    const text = `You requested a password reset. Use this link within 15 minutes: ${resetUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #0f172a;">
        <h2>Reset your JiraLite password</h2>
        <p>You requested a password reset. This link expires in 15 minutes.</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;

    try {
      const emailResult = await sendEmail({
        to: user.email,
        subject,
        text,
        html
      });

      return res.status(200).json({
        success: true,
        message:
          emailResult?.mode === 'console'
            ? 'Email service is not configured, so the reset link was logged in the server terminal for local development.'
            : 'If an account exists for that email, a reset link has been sent.',
        ...(emailResult?.mode === 'console' ? { resetUrl } : {})
      });
    } catch (emailError) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save({ validateBeforeSave: false });
      return next(emailError);
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired'
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return sendAuthResponse(res, 200, user, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};
