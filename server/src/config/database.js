import mongoose from 'mongoose';

/**
 * Connect to MongoDB with robust event handling, timeout configuration, and graceful disconnection.
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('⚠️  MONGODB_URI is not defined in environment variables. Database connection skipped.');
    return null;
  }

  // Obfuscate credentials when logging connection attempt
  const sanitizedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`📡 Connecting to MongoDB at: ${sanitizedURI}`);

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      autoIndex: process.env.NODE_ENV !== 'production', // Build indexes in development
    });

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Do not crash server in dev so health checks can still report database unavailability
    return null;
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB runtime error: ${err.message}`);
});

/**
 * Gracefully close Mongoose connection on process termination.
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed cleanly.');
  } catch (err) {
    console.error(`Error closing MongoDB connection: ${err.message}`);
  }
};
