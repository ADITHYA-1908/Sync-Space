import mongoose from 'mongoose';

/**
 * Health check controller.
 * Returns server operational status, uptime, environment, and MongoDB database connectivity.
 */
export const getHealthStatus = (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());

  // Mongoose readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const responsePayload = {
    status: isDbConnected ? 'ok' : 'degraded',
    message: isDbConnected
      ? 'SyncSpace Server and Database are healthy'
      : 'SyncSpace Server is running, but Database is disconnected',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeSeconds}s`,
    environment: process.env.NODE_ENV || 'development',
    services: {
      server: 'healthy',
      database: dbStatusMap[dbState] || 'unknown',
    },
  };

  // Return HTTP 200 when fully healthy, or HTTP 503 when the database service is unavailable
  const httpStatus = isDbConnected ? 200 : 503;

  res.status(httpStatus).json(responsePayload);
};
