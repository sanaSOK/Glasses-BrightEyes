import { api } from './api';
import type { FrameItem, CreateFramePayload } from '@/types/frame';

export const frameService = {
  async getFrames(query?: {
    page?: number;
    limit?: number;
    search?: string;
    brand?: string;
    model?: string;
    category?: string;
    gender?: string;
    type?: string;
    material?: string;
    frameShape?: string;
    entryType?: string;
    wholesalerId?: string;
  }) {
    const res = await api.get('/frames', { params: query });
    return res.data?.data || res.data;
  },

  async getFrameById(id: string): Promise<FrameItem> {
    const res = await api.get(`/frames/${id}`);
    return res.data?.data || res.data;
  },

  async createFrame(payload: CreateFramePayload): Promise<FrameItem> {
    const res = await api.post('/frames', payload);
    return res.data?.data || res.data;
  },

  async updateFrame(id: string, payload: Partial<CreateFramePayload>): Promise<FrameItem> {
    const res = await api.put(`/frames/${id}`, payload);
    return res.data?.data || res.data;
  },

  async deleteFrame(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/frames/${id}`);
    return res.data?.data || res.data;
  },

  async getStats() {
    const res = await api.get('/frames/stats');
    return res.data?.data || res.data;
  },

  async seedDemo() {
    const res = await api.get('/frames/seed-demo');
    return res.data?.data || res.data;
  },
};
