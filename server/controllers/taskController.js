import { validationResult } from 'express-validator';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { USER_ROLES, normalizeUserRole } from '../models/User.js';
import createActivity from '../utils/createActivity.js';
import { ensureWorkspaceAccess, isPlatformAdmin } from '../utils/workspaceAccess.js';

const canManageAssignments = (user) =>
  [USER_ROLES.PLATFORM_ADMIN, USER_ROLES.WORKSPACE_ADMIN].includes(normalizeUserRole(user.role));

const validateWorkspaceAssignee = async (assignedTo, workspaceId) => {
  if (!assignedTo) {
    return true;
  }

  const assignee = await User.findOne({
    _id: assignedTo,
    workspaceId
  }).select('_id');

  return Boolean(assignee);
};

const canMutateTask = (user, task) =>
  canManageAssignments(user) ||
  task.createdBy.toString() === user._id.toString() ||
  task.assignedTo?.toString() === user._id.toString();

export const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    if (!canManageAssignments(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Only workspace admins can create tasks'
      });
    }

    const project = await Project.findById(req.body.projectId);

    if (!project || !ensureWorkspaceAccess(project.workspaceId, req.user)) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!(await validateWorkspaceAssignee(req.body.assignedTo, project.workspaceId))) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must belong to the selected workspace'
      });
    }

    const task = await Task.create({
      ...req.body,
      workspaceId: project.workspaceId,
      createdBy: req.user._id
    });

    await createActivity({
      userId: req.user._id,
      taskId: task._id,
      projectId: task.projectId,
      action: `${req.user.name} created task "${task.title}"`
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, projectId, assignedTo, page = 1, limit = 10 } = req.query;
    const query = isPlatformAdmin(req.user) ? {} : { workspaceId: req.user.workspaceId };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.title = {
        $regex: search,
        $options: 'i'
      };
    }

    if (projectId) {
      query.projectId = projectId;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (normalizeUserRole(req.user.role) === USER_ROLES.WORKSPACE_MEMBER) {
      query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const totalTasks = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalTasks,
      currentPage: Number(page),
      totalPages: Math.ceil(totalTasks / Number(limit)),
      tasks
    });
  } catch (error) {
    next(error);
  }
};

export const getTasksByProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project || !ensureWorkspaceAccess(project.workspaceId, req.user)) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const query = { projectId: req.params.projectId };

    if (normalizeUserRole(req.user.role) === USER_ROLES.WORKSPACE_MEMBER) {
      query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (!ensureWorkspaceAccess(task.workspaceId, req.user) || !canMutateTask(req.user, task)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    if (!(await validateWorkspaceAssignee(req.body.assignedTo, task.workspaceId))) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must belong to the selected workspace'
      });
    }

    const oldStatus = task.status;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    if (req.body.status && req.body.status !== oldStatus) {
      await createActivity({
        userId: req.user._id,
        taskId: updatedTask._id,
        projectId: updatedTask.projectId,
        action: `${req.user.name} moved task "${updatedTask.title}" to "${updatedTask.status}"`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (!ensureWorkspaceAccess(task.workspaceId, req.user) || !canManageAssignments(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await createActivity({
      userId: req.user._id,
      taskId: task._id,
      projectId: task.projectId,
      action: `${req.user.name} deleted task "${task.title}"`
    });

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
