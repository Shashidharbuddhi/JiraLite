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

    // Activity log
    await createActivity({
      userId: req.user._id,
      taskId: task._id,
      projectId: task.projectId,

      action:
        `${req.user.name} created task "${task.title}"`
    });

    const populatedTask =
      await Task.findById(task._id)
        .populate(
          'assignedTo',
          'name email'
        )
        .populate(
          'projectId',
          'title'
        );

    res.status(201).json({
      success: true,
      message:
        'Task created successfully',
      task: populatedTask
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
      search,
      projectId,
      assignedTo,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // Priority filter
    if (priority) {
      query.priority =
        priority;
    }

    // Search
    if (search) {
      query.title = {
        $regex: search,
        $options: 'i'
      };
    }

    // Project filter
    if (projectId) {
      query.projectId =
        projectId;
    }

    // Assigned user filter
    if (assignedTo) {
      query.assignedTo =
        assignedTo;
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const totalTasks =
      await Task.countDocuments(
        query
      );

    const tasks =
      await Task.find(query)
        .populate(
          'assignedTo',
          'name email'
        )
        .populate(
          'projectId',
          'title'
        )
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalTasks,
      currentPage:
        Number(page),

      totalPages:
        Math.ceil(
          totalTasks /
          Number(limit)
        ),

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
        )
        .sort({
          createdAt: -1
        });

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

    // Ownership check
    if (
      task.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Not authorized to update this task'
      });
    }

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
      )
        .populate(
          'assignedTo',
          'name email'
        )
        .populate(
          'projectId',
          'title'
        );

    // Track status movement
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
      message:
        'Task updated successfully',
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

    // Ownership check
    if (
      task.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Not authorized to delete this task'
      });
    }

    // Activity log
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
        'Task deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};