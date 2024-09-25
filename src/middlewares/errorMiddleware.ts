import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

// Define an interface for error objects

// Global error handling middleware
const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const status = err instanceof AppError ? err.status : 'error';
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack // Show stack trace only in development
  });
};

export default errorHandler;
