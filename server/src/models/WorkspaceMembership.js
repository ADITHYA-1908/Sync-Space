import mongoose from 'mongoose';

const workspaceMembershipSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    role: {
      type: String,
      enum: {
        values: ['owner', 'admin', 'member'],
        message: '{VALUE} is not a valid workspace role',
      },
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Compound unique index prevents duplicate memberships for the same user in a workspace
workspaceMembershipSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

export const WorkspaceMembership = mongoose.model(
  'WorkspaceMembership',
  workspaceMembershipSchema
);
export default WorkspaceMembership;
