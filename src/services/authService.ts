import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  UserProfileResponse,
  UserListResponse,
  UserExpenseStatisticsResponse,
} from "./types";

export const authService = {
  async signUp(data: SignUpRequest): Promise<SignUpResponse> {
    const response = await api.post<SignUpResponse>("/users/sign-up", data);
    await AsyncStorage.setItem("auth_token", response.data.token);
    return response.data;
  },

  async signIn(data: SignInRequest): Promise<SignInResponse> {
    const response = await api.post<SignInResponse>("/users/sign-in", data);
    await AsyncStorage.setItem("auth_token", response.data.token);
    return response.data;
  },

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem("auth_token");
  },

  async getProfile(): Promise<UserProfileResponse> {
    const response = await api.get<UserProfileResponse>("/users/me");
    return response.data;
  },

  async listUsers(): Promise<UserListResponse> {
    const response = await api.get<UserListResponse>("/users");
    return response.data;
  },

  async getStatistics(): Promise<UserExpenseStatisticsResponse> {
    const response = await api.get<UserExpenseStatisticsResponse>("/users/me/statistics");
    return response.data;
  },
};
