import Task from '../models/Task.js';
import { validationResult } from 'express-validator';
import createActivity from '../utils/createActivity.js';


// Create Task
export const createTask =
async (req, res, next) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const task =
      await Task.create({
        ...req.body,
        createdBy: req.user._id
      });

    // Create activity log
    await createActivity({
      userId: req.user._id,
      taskId: task._id,
      projectId: task.projectId,

      action:
        `${req.user.name} created task "${task.title}"`
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};


// Get All Tasks
export const getTasks =
async (req, res, next) => {
  try {
    const {
      status,
      priority,
      search
    } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority =
        priority;
    }

    if (search) {
      query.title = {
        $regex: search,
        $options: 'i'
      };
    }

    const tasks =
      await Task.find(query)
        .populate(
          'assignedTo',
          'name email'
        )
        .populate(
          'projectId',
          'title'
        );

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    next(error);
  }
};


// Get Tasks By Project
export const getTasksByProject =
async (req, res, next) => {
  try {
    const tasks =
      await Task.find({
        projectId:
          req.params.projectId
      })
        .populate(
          'assignedTo',
          'name email'
        )
        .populate(
          'projectId',
          'title'
        );

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    next(error);
  }
};


// Update Task
export const updateTask =
async (req, res, next) => {
  try {
    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          'Task not found'
      });
    }

    // Store old status before update
    const oldStatus =
      task.status;

    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    // Activity tracking for status change
    if (
      req.body.status &&
      req.body.status !== oldStatus
    ) {
      await createActivity({
        userId: req.user._id,

        taskId:
          updatedTask._id,

        projectId:
          updatedTask.projectId,

        action:
          `${req.user.name} moved task "${updatedTask.title}" to "${updatedTask.status}"`
      });
    }

    res.status(200).json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};


// Delete Task
export const deleteTask =
async (req, res, next) => {
  try {
    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          'Task not found'
      });
    }

    // Activity log before delete
    await createActivity({
      userId: req.user._id,

      taskId: task._id,

      projectId:
        task.projectId,

      action:
        `${req.user.name} deleted task "${task.title}"`
    });

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message:
        'Task deleted'
    });
  } catch (error) {
    next(error);
  }
};