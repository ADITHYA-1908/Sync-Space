import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 SyncSpace Server listening on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

// Handle graceful shutdown
const shutdown = () => {
  console.log('\nReceived shutdown signal. Closing server...');
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
