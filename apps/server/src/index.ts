import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { validateEnv, env } from './config/env';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Import route modules
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import applicationRoutes from './modules/applications/application.routes';
import loanRoutes from './modules/loans/loan.routes';
import paymentRoutes from './modules/payments/payment.routes';

// 1. Authoritatively validate environment configurations at startup
validateEnv();

const app = express();

// 2. Setup database connection with retry policies
connectDatabase();

// 3. Mount core request pre-processors
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // Needed for reading secure refresh cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// 4. Serve salary slip uploads securely as static assets
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 5. Mount versioned API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/payments', paymentRoutes);

// 6. Handle unmatched endpoints
app.use(notFound);

// 7. Inject global error interceptor
app.use(errorHandler);

// 8. Start listening on designated port
app.listen(env.PORT, () => {
  console.log(`=========================================`);
  console.log(`LMS REST API Server active on port ${env.PORT}`);
  console.log(`Active Environment: ${env.NODE_ENV}`);
  console.log(`Cors Client Origin: ${env.CLIENT_URL}`);
  console.log(`=========================================`);
});
