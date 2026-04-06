import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { requireOwnerOrAdmin } from '../middlewares/requireOwnerOrAdmin';
import { createExperienceSchema, listExperiencesSchema } from '../validators/experience.validator';
import * as experienceService from '../services/experience.service';
import { errorResponse, successResponse } from '../utils/response';

const router = Router();

// GET /experiences — Public: list published experiences with filters + pagination
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = listExperiencesSchema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid query parameters', result.error.issues));
      return;
    }
    const experiences = experienceService.listExperiences(result.data);
    res.status(200).json(successResponse(experiences));
  } catch (err) {
    next(err);
  }
});

// POST /experiences — Auth: host or admin only
router.post('/', requireAuth , requireRole('host', 'admin'), (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = createExperienceSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid input', result.error.issues));
        return;
      }
      const experience = experienceService.createExperience({
        ...result.data,
        created_by: req.user!.userId,
      });
      res.status(201).json(successResponse(experience));
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /experiences/:id/publish — Auth: owner host or admin
router.patch(
  '/:id/publish',
  requireAuth,
  requireOwnerOrAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const experience = experienceService.publishExperience(req.params.id as string);
      res.status(200).json(successResponse(experience));
    } catch (err) {
      next(err); 
    }
  }
);

// PATCH /experiences/:id/block — Auth: admin only
router.patch(
  '/:id/block',
  requireAuth,
  requireRole('admin'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = experienceService.getExperienceById(req.params.id as string);
      if (!existing) {
        res.status(404).json(errorResponse('NOT_FOUND', 'Experience not found'));
        return;
      }
      const experience = experienceService.blockExperience(req.params.id as string);
      res.status(200).json(successResponse(experience));
    } catch (err) {
      next(err);
    }
  }
);

export default router;