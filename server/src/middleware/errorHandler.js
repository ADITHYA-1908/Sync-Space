/**
 * Global error handling middleware for Express.
 * Catches all unhandled errors and returns structured JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode >= 400 ? res.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.url} - ${message}`);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};

/**
 * 404 Not Found middleware for non-existent routes.
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    },
  });
};
