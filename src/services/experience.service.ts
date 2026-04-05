import db from '../db';
import { HttpError } from '../utils/httpError';
import type { CreateExperienceInput, ListExperiencesQuery } from '../validators/experience.validator';

export const createExperience = (input: CreateExperienceInput & { created_by: string }) => {
  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO experiences (id, title, description, location, price, start_time, created_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')
  `).run(id, input.title, input.description, input.location, input.price, input.start_time, input.created_by);

  return db.prepare('SELECT * FROM experiences WHERE id = ?').get(id);
};

export const getExperienceById = (id: string) => {
  return db.prepare('SELECT * FROM experiences WHERE id = ?').get(id);
};

export const publishExperience = (id: string) => {
  db.prepare("UPDATE experiences SET status = 'published' WHERE id = ?").run(id);
  return db.prepare('SELECT * FROM experiences WHERE id = ?').get(id);
};

export const blockExperience = (id: string) => {
  db.prepare("UPDATE experiences SET status = 'blocked' WHERE id = ?").run(id);
  return db.prepare('SELECT * FROM experiences WHERE id = ?').get(id);
};

export const listExperiences = (query: ListExperiencesQuery) => {
  const { location, from, to, page, limit, sort } = query;
  const params: (string | number)[] = [];

  let sql = "SELECT * FROM experiences WHERE status = 'published'";

  if (location) {
    sql += ' AND location = ?';
    params.push(location);
  }
  if (from) {
    sql += ' AND start_time >= ?';
    params.push(from);
  }
  if (to) {
    sql += ' AND start_time <= ?';
    params.push(to);
  }

  sql += ` ORDER BY start_time ${sort === 'desc' ? 'DESC' : 'ASC'}`;
  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, (page - 1) * limit);

  return db.prepare(sql).all(...params);
};