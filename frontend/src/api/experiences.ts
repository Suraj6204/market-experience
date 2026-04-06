import { api } from './client';
import type { Experience, ListParams } from '../types';

export const experiencesApi = {
  list: (params: ListParams = {}) => {
    const q = new URLSearchParams();
    if (params.location) q.set('location', params.location);
    if (params.from)     q.set('from', params.from);
    if (params.to)       q.set('to', params.to);
    if (params.page)     q.set('page', String(params.page));
    if (params.limit)    q.set('limit', String(params.limit));
    if (params.sort)     q.set('sort', params.sort);
    const qs = q.toString();
    return api.get<Experience[]>(`/experiences${qs ? `?${qs}` : ''}`);
  },

  create: (data: {
    title: string; description: string; location: string;
    price: number; start_time: string;
  }) => api.post<Experience>('/experiences', data),

  publish: (id: string) => api.patch<Experience>(`/experiences/${id}/publish`),
  block:   (id: string) => api.patch<Experience>(`/experiences/${id}/block`),
};