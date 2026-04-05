import express from 'express';
import { config } from './config';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import experienceRoutes from './routes/experiences';
import bookingRoutes from './routes/bookings';
import healthRoutes from './routes/health';

const app = express();

app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/auth', authRoutes);
app.use('/experiences', experienceRoutes);
app.use('/experiences', bookingRoutes);
app.use('/health', healthRoutes);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});

export default app;