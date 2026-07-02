import express from 'express';
import { authorize, protect } from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../models/User.js';
import {
  getCurrentWorkspace,
  inviteWorkspaceMember,
  removeWorkspaceMember,
  updateWorkspaceMember
} from '../controllers/workspaceController.js';

const router = express.Router();

router.use(protect);

router.get('/current', getCurrentWorkspace);
router.post('/current/members', authorize(USER_ROLES.WORKSPACE_ADMIN), inviteWorkspaceMember);
router.patch('/current/members/:memberId', authorize(USER_ROLES.WORKSPACE_ADMIN), updateWorkspaceMember);
router.delete('/current/members/:memberId', authorize(USER_ROLES.WORKSPACE_ADMIN), removeWorkspaceMember);

export default router;
