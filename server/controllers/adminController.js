import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User, { USER_ROLES } from '../models/User.js';
import Workspace, { WORKSPACE_STATUSES } from '../models/Workspace.js';

export const getPlatformOverview = async (req, res, next) => {
  try {
    const [totalUsers, totalWorkspaces, suspendedWorkspaces, activeWorkspaces, totalProjects, totalTasks] = await Promise.all([
      User.countDocuments(),
      Workspace.countDocuments(),
      Workspace.countDocuments({ status: WORKSPACE_STATUSES.SUSPENDED }),
      Workspace.countDocuments({ status: WORKSPACE_STATUSES.ACTIVE }),
      Project.countDocuments(),
      Task.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalWorkspaces,
        suspendedWorkspaces,
        activeWorkspaces,
        totalProjects,
        totalTasks
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find()
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    res.status(200).json({
      success: true,
      workspaces
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspaceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    workspace.status = status;
    await workspace.save();

    await User.updateMany(
      { workspaceId: workspace._id, role: { $ne: USER_ROLES.PLATFORM_ADMIN } },
      { isSuspended: status === WORKSPACE_STATUSES.SUSPENDED }
    );

    res.status(200).json({
      success: true,
      workspace
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    await User.deleteMany({ workspaceId: workspace._id });
    await workspace.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Workspace deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('workspaceId', 'name slug status');

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own platform admin account'
      });
    }

    if (user.workspaceId) {
      const workspace = await Workspace.findById(user.workspaceId);

      if (workspace) {
        if (workspace.owner.toString() === user._id.toString()) {
          return res.status(400).json({
            success: false,
            message: 'Delete or transfer the workspace before removing its owner'
          });
        }

        workspace.members = workspace.members.filter(
          (memberId) => memberId.toString() !== user._id.toString()
        );
        await workspace.save();
      }
    }

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      userId: user._id.toString()
    });
  } catch (error) {
    next(error);
  }
};
