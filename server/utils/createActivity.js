import Activity
from '../models/Activity.js';

const createActivity =
async ({
  userId,
  taskId = null,
  projectId = null,
  action
}) => {
  await Activity.create({
    userId,
    taskId,
    projectId,
    action
  });
};

export default createActivity;