import Task
from '../models/Task.js';

import { validationResult }
from 'express-validator';


// Create Task
export const createTask =
async (req, res, next) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors:
          errors.array()
      });
    }

    const task =
      await Task.create({
        ...req.body,
        createdBy:
          req.user._id
      });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};


// Get Tasks
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


// Get Project Tasks
export const getTasksByProject =
async (req, res, next) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors:
          errors.array()
      });
    }

    const tasks =
      await Task.find({
        projectId:
          req.params.projectId
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

    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    res.status(200).json({
      success: true,
      task:
        updatedTask
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
