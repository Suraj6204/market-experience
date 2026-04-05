import { Request, Response, NextFunction } from 'express';
import db from '../db';
import { errorResponse } from '../utils/response';

interface Experience {
  id: string;
  created_by: string;
  status: string;
}

export const requireOwnerOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  const experience = db
    .prepare('SELECT id, created_by, status FROM experiences WHERE id = ?')
    .get(id) as Experience | undefined;

  if (!experience) {
    res.status(404).json(errorResponse('NOT_FOUND', 'Experience not found'));
    return;
  }

  const isAdmin = req.user?.role === 'admin';
  const isOwner = experience.created_by === req.user?.userId;

  if (!isAdmin && !isOwner) {
    res.status(403).json(
      errorResponse('FORBIDDEN', 'Only the owner or an admin can perform this action')
    );
    return;
  }

  next();
};