import express
from 'express';

import protect
from '../middlewares/authMiddleware.js';

import {
  createTask,
  getTasks,
  getTasksByProject,
  updateTask,
  deleteTask
}
from '../controllers/taskController.js';

import {
  taskValidation,
  projectIdParamValidation
}
from '../validators/taskValidator.js';

const router =
  express.Router();

router
  .route('/')
  .post(
    protect,
    taskValidation,
    createTask
  )
  .get(
    protect,
    getTasks
  );

router.get(
  '/project/:projectId',
  protect,
  projectIdParamValidation,
  getTasksByProject
);

router
  .route('/:id')
  .patch(
    protect,
    updateTask
  )
  .delete(
    protect,
    deleteTask
  );

export default router;
