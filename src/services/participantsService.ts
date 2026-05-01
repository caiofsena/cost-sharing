import api from './api';
import type {
  AddParticipantsRequest,
  AddParticipantsResponse,
  ActivityParticipantsResponse,
  RemoveParticipantResponse,
} from './types';

export const participantsService = {
  async list(activityId: string): Promise<ActivityParticipantsResponse> {
    const response = await api.get<ActivityParticipantsResponse>(
      `/activities/${activityId}/participants`
    );
    return response.data;
  },

  async add(
    activityId: string,
    data: AddParticipantsRequest
  ): Promise<AddParticipantsResponse> {
    const response = await api.post<AddParticipantsResponse>(
      `/activities/${activityId}/participants`,
      data
    );
    return response.data;
  },

  async remove(
    activityId: string,
    userId: string
  ): Promise<RemoveParticipantResponse> {
    const response = await api.delete<RemoveParticipantResponse>(
      `/activities/${activityId}/participants/${userId}`
    );
    return response.data;
  },
};
