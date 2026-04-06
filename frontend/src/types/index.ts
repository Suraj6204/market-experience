export type Role = 'admin' | 'host' | 'user';
export type ExperienceStatus = 'draft' | 'published' | 'blocked';
export type BookingStatus = 'confirmed' | 'cancelled';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: { id: string; role: Role };
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  start_time: string;
  created_by: string;
  status: ExperienceStatus;
  created_at: string;
}

export interface Booking {
  id: string;
  experience_id: string;
  user_id: string;
  seats: number;
  status: BookingStatus;
  created_at: string;
}

export interface ApiError {
  error: { code: string; message: string; details: unknown[] };
}

export interface ListParams {
  location?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
}