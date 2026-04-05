import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json(
        errorResponse('FORBIDDEN', `Access restricted to roles: ${roles.join(', ')}`)
      );
      return;
    }
    next();
  };
};