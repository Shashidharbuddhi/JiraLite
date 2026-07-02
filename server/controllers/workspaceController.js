import User, { USER_ROLES } from '../models/User.js';
import Workspace from '../models/Workspace.js';

const getWorkspaceWithRelations = (workspaceId) =>
  Workspace.findById(workspaceId)
    .populate('owner', 'name email role')
    .populate('members', 'name email role createdAt isSuspended');

export const getCurrentWorkspace = async (req, res, next) => {
  try {
    const workspace = await getWorkspaceWithRelations(req.user.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    res.status(200).json({
      success: true,
      workspace
    });
  } catch (error) {
    next(error);
  }
};

export const inviteWorkspaceMember = async (req, res, next) => {
  try {
    const { name, email, password, role = USER_ROLES.WORKSPACE_MEMBER } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (![USER_ROLES.WORKSPACE_ADMIN, USER_ROLES.WORKSPACE_MEMBER].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workspace role'
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const member = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
      workspaceId: req.user.workspaceId
    });

    await Workspace.findByIdAndUpdate(req.user.workspaceId, {
      $addToSet: { members: member._id }
    });

    res.status(201).json({
      success: true,
      member: {
        _id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        workspaceId: member.workspaceId,
        createdAt: member.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspaceMember = async (req, res, next) => {
  try {
    const { role, isSuspended } = req.body;
    const member = await User.findOne({
      _id: req.params.memberId,
      workspaceId: req.user.workspaceId
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Workspace member not found'
      });
    }

    if (member._id.toString() === req.user._id.toString() && role && role !== member.role) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    if (role && [USER_ROLES.WORKSPACE_ADMIN, USER_ROLES.WORKSPACE_MEMBER].includes(role)) {
      member.role = role;
    }

    if (typeof isSuspended === 'boolean') {
      member.isSuspended = isSuspended;
    }

    await member.save();

    res.status(200).json({
      success: true,
      member: {
        _id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        workspaceId: member.workspaceId,
        isSuspended: member.isSuspended,
        createdAt: member.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const removeWorkspaceMember = async (req, res, next) => {
  try {
    const member = await User.findOne({
      _id: req.params.memberId,
      workspaceId: req.user.workspaceId
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Workspace member not found'
      });
    }

    if (member._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove yourself from the workspace'
      });
    }

    await Workspace.findByIdAndUpdate(req.user.workspaceId, {
      $pull: { members: member._id }
    });

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Workspace member removed'
    });
  } catch (error) {
    next(error);
  }
};
