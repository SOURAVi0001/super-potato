import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error stacks to console
  console.error(`[ERROR] ${req.method} ${req.path} - ${statusCode}:`, err);

  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).map(key => ({
      field: key,
      message: err.errors[key].message
    }));
    sendError(res, 'Database validation failed.', 400, errors);
    return;
  }

  sendError(res, message, statusCode);
}
