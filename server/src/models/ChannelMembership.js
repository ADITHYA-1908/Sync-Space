import mongoose from 'mongoose';

const channelMembershipSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: [true, 'Channel reference is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
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

// Compound unique index prevents duplicate memberships in the same channel
channelMembershipSchema.index({ channelId: 1, userId: 1 }, { unique: true });

export const ChannelMembership = mongoose.model(
  'ChannelMembership',
  channelMembershipSchema
);
export default ChannelMembership;
