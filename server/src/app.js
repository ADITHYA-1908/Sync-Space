import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware: CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to ease local development
    },
    credentials: true,
  })
);

// Middleware: Parse JSON request bodies
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'SyncSpace API',
    version: '1.0.0',
    description: 'Real-time team communication platform backend API',
    endpoints: {
      health: '/api/health',
    },
  });
});

// Mount Routes
app.use('/api/health', healthRoutes);

// Catch 404s
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
