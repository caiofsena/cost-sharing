import api from './api';
import type {
  CreateExpenseRequest,
  CreateExpenseResponse,
  UpdateExpenseRequest,
  ExpenseListResponse,
  ExpenseDetailResponse,
  SetExpensePayerRequest,
  SetExpensePayerResponse,
  MarkPaymentRequest,
  MarkPaymentResponse,
  ToggleParticipantPaymentResponse,
} from './types';

export const expensesService = {
  async create(activityId: string, data: CreateExpenseRequest): Promise<CreateExpenseResponse> {
    const response = await api.post<CreateExpenseResponse>(
      `/activities/${activityId}/expenses`,
      data
    );
    return response.data;
  },

  async listByActivity(activityId: string): Promise<ExpenseListResponse> {
    const response = await api.get<ExpenseListResponse>(
      `/activities/${activityId}/expenses`
    );
    return response.data;
  },

  async getById(expenseId: string): Promise<ExpenseDetailResponse> {
    const response = await api.get<ExpenseDetailResponse>(`/expenses/${expenseId}`);
    return response.data;
  },

  async update(expenseId: string, data: UpdateExpenseRequest): Promise<CreateExpenseResponse> {
    const response = await api.put<CreateExpenseResponse>(`/expenses/${expenseId}`, data);
    return response.data;
  },

  async delete(expenseId: string): Promise<number> {
    const response = await api.delete<number>(`/expenses/${expenseId}`);
    return response.data;
  },

  async setPayer(
    expenseId: string,
    data: SetExpensePayerRequest
  ): Promise<SetExpensePayerResponse> {
    const response = await api.put<SetExpensePayerResponse>(
      `/expenses/${expenseId}/payer`,
      data
    );
    return response.data;
  },

  async markPayment(
    expenseId: string,
    data: MarkPaymentRequest
  ): Promise<MarkPaymentResponse> {
    const response = await api.post<MarkPaymentResponse>(
      `/expenses/${expenseId}/payments`,
      data
    );
    return response.data;
  },

  async toggleParticipantPayment(
    expenseId: string,
    participantId: string
  ): Promise<ToggleParticipantPaymentResponse> {
    const response = await api.put<ToggleParticipantPaymentResponse>(
      `/expenses/${expenseId}/participants/${participantId}/payment/toggle`
    );
    return response.data;
  },
};
