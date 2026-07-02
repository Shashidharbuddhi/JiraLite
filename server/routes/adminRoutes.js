import express from 'express';
import {
  deleteUser,
  getAllUsers,
  getAllWorkspaces,
  getPlatformOverview,
  updateWorkspaceStatus,
  deleteWorkspace
} from '../controllers/adminController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = express.Router();

router.use(protect, authorize(USER_ROLES.PLATFORM_ADMIN));

router.get('/analytics', getPlatformOverview);
router.get('/workspaces', getAllWorkspaces);
router.patch('/workspaces/:workspaceId/status', updateWorkspaceStatus);
router.delete('/workspaces/:workspaceId', deleteWorkspace);
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);

export default router;
