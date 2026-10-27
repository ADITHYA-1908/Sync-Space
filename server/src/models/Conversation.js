import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: {
        values: ['direct'],
        message: '{VALUE} is not a valid conversation type',
      },
      default: 'direct',
    },
    participantIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      ],
      validate: [
        {
          validator: function (participants) {
            return Array.isArray(participants) && participants.length === 2;
          },
          message: 'Direct conversations must have exactly 2 participants',
        },
        {
          validator: function (participants) {
            if (!Array.isArray(participants) || participants.length < 2) return true;
            return participants[0].toString() !== participants[1].toString();
          },
          message: 'Participants in a direct conversation must be two distinct users',
        },
      ],
      required: [true, 'Participants list is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to sort participant IDs deterministically (ensures [UserA, UserB] === [UserB, UserA])
conversationSchema.pre('save', function () {
  if (this.participantIds && this.participantIds.length === 2) {
    this.participantIds.sort((a, b) => a.toString().localeCompare(b.toString()));
  }
});

// Index for locating conversations by participants
conversationSchema.index({ participantIds: 1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
