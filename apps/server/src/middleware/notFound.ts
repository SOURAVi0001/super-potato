import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export function notFound(req: Request, res: Response, next: NextFunction): void {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
