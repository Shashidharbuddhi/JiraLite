import express
from 'express';

import protect
from '../middlewares/authMiddleware.js';

import {
  getActivities,
  getProjectActivities
}
from '../controllers/activityController.js';

const router =
  express.Router();

router.get(
  '/',
  protect,
  getActivities
);

router.get(
  '/project/:projectId',
  protect,
  getProjectActivities
);

export default router;