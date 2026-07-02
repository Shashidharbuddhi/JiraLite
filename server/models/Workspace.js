import mongoose from 'mongoose';

export const WORKSPACE_STATUSES = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended'
};

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: Object.values(WORKSPACE_STATUSES),
      default: WORKSPACE_STATUSES.ACTIVE
    }
  },
  {
    timestamps: true
  }
);

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
