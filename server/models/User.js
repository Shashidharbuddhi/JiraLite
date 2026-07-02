import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const USER_ROLES = {
  PLATFORM_ADMIN: 'platform_admin',
  WORKSPACE_ADMIN: 'workspace_admin',
  WORKSPACE_MEMBER: 'workspace_member'
};

const LEGACY_ROLE_MAP = {
  admin: USER_ROLES.WORKSPACE_ADMIN,
  member: USER_ROLES.WORKSPACE_MEMBER
};

export const normalizeUserRole = (role) => LEGACY_ROLE_MAP[role] || role || USER_ROLES.WORKSPACE_MEMBER;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minLength: 6
    },
    role: {
      type: String,
      enum: [
        USER_ROLES.PLATFORM_ADMIN,
        USER_ROLES.WORKSPACE_ADMIN,
        USER_ROLES.WORKSPACE_MEMBER,
        'admin',
        'member'
      ],
      default: USER_ROLES.WORKSPACE_MEMBER,
      set: normalizeUserRole
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      default: null
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    emailVerified: {
      type: Boolean,
      default: true
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpire: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function savePassword() {
  if (!this.isModified('password')) {
    return;
  }

  if (this.$locals?.skipPasswordHash) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getNormalizedRole = function getNormalizedRole() {
  return normalizeUserRole(this.role);
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
