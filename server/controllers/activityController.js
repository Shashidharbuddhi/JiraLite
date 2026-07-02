import Activity from '../models/Activity.js';
import Project from '../models/Project.js';
import { ensureWorkspaceAccess, isPlatformAdmin } from '../utils/workspaceAccess.js';

export const getActivities = async (req, res, next) => {
  try {
    const projectQuery = isPlatformAdmin(req.user) ? {} : { workspaceId: req.user.workspaceId };
    const accessibleProjects = await Project.find(projectQuery).select('_id');
    const projectIds = accessibleProjects.map((project) => project._id);

    const activities = await Activity.find(
      isPlatformAdmin(req.user) ? {} : { projectId: { $in: projectIds } }
    )
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectActivities = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId).select('workspaceId');

    if (!project || !ensureWorkspaceAccess(project.workspaceId, req.user)) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const activities = await Activity.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    next(error);
  }
};
