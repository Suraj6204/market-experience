import { api } from './client';
import type { AuthResponse, Role } from '../types';

export const authApi = {
  signup: (email: string, password: string, role: Role) =>
    api.post<{ id: string; email: string; role: Role }>('/auth/signup', { email, password, role }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};