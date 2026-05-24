import { body, param }
from 'express-validator';

export const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage(
      'Task title is required'
    ),

  body('priority')
    .optional()
    .isIn([
      'Low',
      'Medium',
      'High',
      'Critical'
    ])
    .withMessage(
      'Invalid priority'
    ),

  body('status')
    .optional()
    .isIn([
      'Todo',
      'In Progress',
      'Review',
      'Done'
    ])
    .withMessage(
      'Invalid status'
    ),

  body('projectId')
    .notEmpty()
    .withMessage(
      'projectId is required'
    )
    .bail()
    .isMongoId()
    .withMessage(
      'Invalid projectId'
    ),

  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage(
      'Invalid assignedTo user id'
    )
];

export const projectIdParamValidation = [
  param('projectId')
    .isMongoId()
    .withMessage('Invalid projectId')
];
