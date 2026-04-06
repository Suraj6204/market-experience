import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /health — Observability: checks DB connectivity
router.get('/', (_req: Request, res: Response) => {
  try {
    db.prepare('SELECT 1').get();
    res.status(200).json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected', timestamp: new Date().toISOString() });
  }
});

export default router;