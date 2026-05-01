import api from './api';
import type {
  ActivityBalanceResponse,
  UserGlobalBalanceResponse,
  DetailedBalanceResponse,
  BalanceBetweenUsersResponse,
} from './types';

export const balanceService = {
  async getActivityBalance(activityId: string): Promise<ActivityBalanceResponse> {
    const response = await api.get<ActivityBalanceResponse>(
      `/activities/${activityId}/balance`
    );
    return response.data;
  },

  async getUserGlobalBalance(userId: string): Promise<UserGlobalBalanceResponse> {
    const response = await api.get<UserGlobalBalanceResponse>(
      `/balance/users/${userId}/global`
    );
    return response.data;
  },

  async getUserDetailedBalance(userId: string): Promise<DetailedBalanceResponse> {
    const response = await api.get<DetailedBalanceResponse>(
      `/balance/users/${userId}/detailed`
    );
    return response.data;
  },

  async getBalanceBetweenUsers(
    userId1: string,
    userId2: string
  ): Promise<BalanceBetweenUsersResponse> {
    const response = await api.get<BalanceBetweenUsersResponse>(
      `/balance/between/${userId1}/${userId2}`
    );
    return response.data;
  },
};
