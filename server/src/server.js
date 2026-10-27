import dotenv from 'dotenv';
import app from './app.js';
import { connectDB, disconnectDB } from './config/database.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database connection before serving traffic
connectDB();

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 SyncSpace Server listening on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

// Handle graceful process shutdown
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down SyncSpace server...`);
  
  server.close(async () => {
    console.log('HTTP server closed.');
    await disconnectDB();
    process.exit(0);
  });

  // Force exit after 10 seconds if hanging
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
