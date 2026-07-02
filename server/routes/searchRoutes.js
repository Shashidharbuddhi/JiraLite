import express from 'express';
import { searchWorkspace } from '../controllers/searchController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, searchWorkspace);

export default router;
