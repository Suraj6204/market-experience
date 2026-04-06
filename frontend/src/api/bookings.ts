import { api } from './client';
import type { Booking } from '../types';

export const bookingsApi = {
  book: (experienceId: string, seats: number) =>
    api.post<Booking>(`/experiences/${experienceId}/book`, { seats }),
};