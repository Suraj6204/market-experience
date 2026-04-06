import db from '../db';
import { HttpError } from '../utils/httpError';
import type { BookingInput } from '../validators/booking.validator';

interface ExperienceRow {
  id: string;
  created_by: string;
  status: string;
}

export const createBooking = (
  experienceId: string,
  userId: string,
  input: BookingInput
) => {
  const { seats } = input;

  const experience = db
    .prepare('SELECT id, created_by, status FROM experiences WHERE id = ?')
    .get(experienceId) as ExperienceRow | undefined;

  if (!experience) {
    throw new HttpError(404, 'NOT_FOUND', 'Experience not found');
  }

  if (experience.status !== 'published') {
    throw new HttpError(400, 'NOT_PUBLISHED', 'You can only book a published experience');
  }

  if (experience.created_by === userId) {
    throw new HttpError(403, 'FORBIDDEN', 'Hosts cannot book their own experience');
  }

  // Check for existing confirmed booking (also enforced by DB UNIQUE constraint)
  const existing = db.prepare(`
    SELECT id FROM bookings
    WHERE user_id = ? AND experience_id = ? AND status = 'confirmed'
  `).get(userId, experienceId);

  if (existing) {
    throw new HttpError(400, 'DUPLICATE_BOOKING', 'You already have a confirmed booking for this experience');
  }

  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO bookings (id, experience_id, user_id, seats, status)
    VALUES (?, ?, ?, ?, 'confirmed')
  `).run(id, experienceId, userId, seats);

  return db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
};