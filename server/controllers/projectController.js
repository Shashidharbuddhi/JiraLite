import Project from '../models/Project.js';
import { USER_ROLES, normalizeUserRole } from '../models/User.js';
import { ensureWorkspaceAccess, isPlatformAdmin } from '../utils/workspaceAccess.js';

const canManageProjects = (user) =>
  [USER_ROLES.PLATFORM_ADMIN, USER_ROLES.WORKSPACE_ADMIN].includes(normalizeUserRole(user.role));

export const createProject = async (req, res, next) => {
  try {
    if (!canManageProjects(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Only workspace admins can create projects'
      });
    }

    const { title, description, deadLine, members, workspaceId: requestedWorkspaceId } = req.body;
    const workspaceId = isPlatformAdmin(req.user) ? requestedWorkspaceId : req.user.workspaceId;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: 'Workspace is required to create a project'
      });
    }

    const project = await Project.create({
      title,
      description,
      deadLine,
      members,
      workspaceId,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const query = isPlatformAdmin(req.user) ? {} : { workspaceId: req.user.workspaceId };

    const projects = await Project.find(query)
      .populate('members', 'name email role workspaceId')
      .populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email role workspaceId')
      .populate('createdBy', 'name email role');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!ensureWorkspaceAccess(project.workspaceId, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    if (!canManageProjects(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Only workspace admins can update projects'
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!ensureWorkspaceAccess(project.workspaceId, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
      success: true,
      project: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    if (!canManageProjects(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Only workspace admins can delete projects'
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!ensureWorkspaceAccess(project.workspaceId, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
