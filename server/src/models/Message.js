import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message sender is required'],
      index: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      default: null,
      index: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      default: null,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true,
      minlength: [1, 'Message must be at least 1 character long'],
      maxlength: [4000, 'Message cannot exceed 4000 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['text', 'system'],
        message: '{VALUE} is not a valid message type',
      },
      default: 'text',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Data Integrity Constraint:
 * A message MUST belong to either a channel OR a direct conversation, never both and never neither.
 */
messageSchema.pre('validate', function () {
  const hasChannel = Boolean(this.channelId);
  const hasConversation = Boolean(this.conversationId);

  if (hasChannel && hasConversation) {
    this.invalidate(
      'destination',
      'A message cannot belong to both a channel and a direct conversation simultaneously.'
    );
  } else if (!hasChannel && !hasConversation) {
    this.invalidate(
      'destination',
      'A message must specify either a channelId or a conversationId destination.'
    );
  }
});

// Chronological querying indexes for high-performance message paging
messageSchema.index({ channelId: 1, createdAt: 1 });
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model('Message', messageSchema);
export default Message;
