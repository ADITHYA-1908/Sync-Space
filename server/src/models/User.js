import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      minlength: [6, 'Password hash must be valid'],
      select: false, // Exclude passwordHash from queries by default for security
    },
    avatar: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['online', 'away', 'busy', 'offline'],
        message: '{VALUE} is not a supported status',
      },
      default: 'offline',
    },
    statusText: {
      type: String,
      trim: true,
      maxlength: [100, 'Status text cannot exceed 100 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const User = mongoose.model('User', userSchema);
export default User;
