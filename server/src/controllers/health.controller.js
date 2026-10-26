/**
 * Health check controller.
 * Returns server operational status, uptime, and timestamp.
 */
export const getHealthStatus = (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  
  res.status(200).json({
    status: 'ok',
    message: 'SyncSpace Server is active and healthy',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeSeconds}s`,
    environment: process.env.NODE_ENV || 'development',
  });
};
