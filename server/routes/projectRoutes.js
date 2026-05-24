import express from 'express';

import protect from '../middlewares/authMiddleware.js';

import{createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/projectController.js';

const router=express.Router();

router
    .route('/')
    .post(protect,createProject)
    .get(protect,getProjects);

router  
    .route('/:id')
    .get(protect,getProjectById)
    .patch(protect,updateProject)
    .delete(protect,deleteProject);

export default router;
