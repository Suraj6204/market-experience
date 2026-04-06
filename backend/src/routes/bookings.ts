import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { bookingSchema } from '../validators/booking.validator';
import * as bookingService from '../services/booking.service';
import { errorResponse, successResponse } from '../utils/response';

const router = Router();

// POST /experiences/:id/book — Auth: user or admin only (hosts cannot book)
router.post(
  '/:id/book',
  requireAuth,
  requireRole('user', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = bookingSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid input', result.error.issues));
        return;
      }
      const booking = await bookingService.createBooking(
        req.params.id as string,
        req.user!.userId,
        result.data
      );
      res.status(201).json(successResponse(booking));
    } catch (err) {
      next(err);
    }
  }
);

export default router;