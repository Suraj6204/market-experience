import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import { config } from '../config';
import { HttpError } from '../utils/httpError';
import type { SignupInput, LoginInput } from '../validators/auth.validator';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'host' | 'user';
}

export const signup = async (input: SignupInput) => {
  const { email, password, role } = input;

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw new HttpError(400, 'EMAIL_TAKEN', 'An account with this email already exists');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  db.prepare(
    'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(id, email, password_hash, role);

  return { id, email, role };
};

export const login = async (input: LoginInput) => {
  const { email, password } = input;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;

  // Use same error for both "user not found" and "wrong password" to prevent user enumeration
  if (!user) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: { id: user.id, role: user.role },
  };
};