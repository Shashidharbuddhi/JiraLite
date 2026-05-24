import mongoose from 'mongoose';

const taskSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true
      },

      description: {
        type: String
      },

      priority: {
        type: String,
        enum: [
          'Low',
          'Medium',
          'High',
          'Critical'
        ],
        default: 'Medium'
      },

      status: {
        type: String,
        enum: [
          'Todo',
          'In Progress',
          'Review',
          'Done'
        ],
        default: 'Todo'
      },

      assignedTo: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },

      projectId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Project',

        required: true
      },

      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'User',

        required: true
      },

      dueDate: {
        type: Date
      }
    },
    {
      timestamps: true
    }
  );

const Task =
  mongoose.model(
    'Task',
    taskSchema
  );

export default Task;