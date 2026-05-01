import api from './api';
import type {
  CreateActivityRequest,
  CreateActivityResponse,
  UpdateActivityRequest,
  ActivityListResponse,
  ActivityDetailResponse,
} from './types';

export const activitiesService = {
  async create(data: CreateActivityRequest): Promise<CreateActivityResponse> {
    const response = await api.post<CreateActivityResponse>('/activities', data);
    return response.data;
  },

  async getById(activityId: string): Promise<ActivityDetailResponse> {
    const response = await api.get<ActivityDetailResponse>(`/activities/${activityId}`);
    return response.data;
  },

  async update(activityId: string, data: UpdateActivityRequest): Promise<CreateActivityResponse> {
    const response = await api.put<CreateActivityResponse>(`/activities/${activityId}`, data);
    return response.data;
  },

  async delete(activityId: string): Promise<number> {
    const response = await api.delete<number>(`/activities/${activityId}`);
    return response.data;
  },

  async listByUser(userId: string): Promise<ActivityListResponse> {
    const response = await api.get<ActivityListResponse>(`/users/${userId}/activities`);
    return response.data;
  },
};
