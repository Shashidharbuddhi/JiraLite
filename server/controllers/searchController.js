import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import { isPlatformAdmin } from '../utils/workspaceAccess.js';

const buildRegex = (query) => new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

export const searchWorkspace = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const regex = buildRegex(query);
    const workspaceQuery = isPlatformAdmin(req.user) ? {} : { workspaceId: req.user.workspaceId };

    const [projects, tasks, activities] = await Promise.all([
      Project.find({
        ...workspaceQuery,
        $or: [{ title: regex }, { description: regex }]
      })
        .select('title description deadLine members createdAt')
        .limit(5),
      Task.find({
        ...workspaceQuery,
        $or: [{ title: regex }, { description: regex }]
      })
        .populate('projectId', 'title')
        .select('title description status priority dueDate projectId createdAt')
        .limit(8),
      Activity.find({
        action: regex
      })
        .populate({
          path: 'projectId',
          select: 'title workspaceId',
          match: workspaceQuery
        })
        .select('action projectId createdAt')
        .limit(6)
    ]);

    res.status(200).json({
      success: true,
      query,
      results: {
        projects,
        tasks,
        activities: activities.filter((item) => item.projectId)
      }
    });
  } catch (error) {
    next(error);
  }
};
