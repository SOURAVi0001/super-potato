import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: { page: number; limit: number; total: number; totalPages: number }
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta && { meta }),
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: any[]
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}
