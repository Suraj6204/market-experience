import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { HttpError } from '../utils/httpError';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Error]', err);

  if (err instanceof HttpError) {
    res.status(err.status).json(errorResponse(err.code, err.message, err.details));
    return;
  }

  res.status(500).json(
    errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred')
  );
};