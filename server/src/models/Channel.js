import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Channel name is required'],
      lowercase: true,
      trim: true,
      minlength: [2, 'Channel name must be at least 2 characters'],
      maxlength: [40, 'Channel name cannot exceed 40 characters'],
      match: [
        /^[a-z0-9_-]+$/,
        'Channel name can only contain lowercase alphanumeric characters, hyphens, and underscores',
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, 'Description cannot exceed 250 characters'],
      default: '',
    },
    type: {
      type: String,
      enum: {
        values: ['public', 'private'],
        message: '{VALUE} is not a valid channel type',
      },
      default: 'public',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator user reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index enforces unique channel names within a single workspace
channelSchema.index({ workspaceId: 1, name: 1 }, { unique: true });

export const Channel = mongoose.model('Channel', channelSchema);
export default Channel;
