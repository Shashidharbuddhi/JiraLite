import mongoose from 'mongoose';

const activitySchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

      taskId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      },

      projectId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      },

      action: {
        type: String,
        required: true
      }
    },
    {
      timestamps: true
    }
  );

const Activity =
  mongoose.model(
    'Activity',
    activitySchema
  );

export default Activity;