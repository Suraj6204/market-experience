import { Router, Request, Response, NextFunction } from 'express';
import { signupSchema, loginSchema } from '../validators/auth.validator';
import * as authService from '../services/auth.service';
import { errorResponse, successResponse } from '../utils/response';

const router = Router();

// POST /auth/signup
router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success){
      res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid input', result.error.issues));
      return;
    }
    const user = await authService.signup(result.data);
    res.status(201).json(successResponse(user));
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid input', result.error.issues));
      return;
    }
    const data = await authService.login(result.data);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;