import Activity
from '../models/Activity.js';


// Get All Activities
export const getActivities =
async (req, res, next) => {
  try {
    const activities =
      await Activity.find()
        .sort({
          createdAt: -1
        })
        .populate(
          'userId',
          'name'
        );

    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    next(error);
  }
};


// Get Project Activities
export const
getProjectActivities =
async (req, res, next) => {
  try {
    const activities =
      await Activity.find({
        projectId:
          req.params.projectId
      })
        .sort({
          createdAt: -1
        })
        .populate(
          'userId',
          'name'
        );

    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    next(error);
  }
};