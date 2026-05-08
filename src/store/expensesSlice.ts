import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { expensesService } from "../services";
import type {
  ExpenseListItem,
  ExpenseDetailResponse,
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from "../services/types";

interface ExpensesState {
  items: ExpenseListItem[];
  current: ExpenseDetailResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

function extractErrorMessage(err: any, fallback: string): string {
  const data = err?.response?.data;
  if (typeof data === "string") return data;
  if (data?.reason) return data.reason;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors[0];
  if (err?.message) return err.message;
  return fallback;
}

export const fetchExpensesByActivity = createAsyncThunk(
  "expenses/fetchByActivity",
  async (activityId: string, { rejectWithValue }) => {
    try {
      const response = await expensesService.listByActivity(activityId);
      return response.expenses;
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar despesas"));
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  "expenses/fetchById",
  async (expenseId: string, { rejectWithValue }) => {
    try {
      return await expensesService.getById(expenseId);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar despesa"));
    }
  }
);

export const createExpense = createAsyncThunk(
  "expenses/create",
  async ({ activityId, data }: { activityId: string; data: CreateExpenseRequest }, { rejectWithValue }) => {
    try {
      return await expensesService.create(activityId, data);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao criar despesa"));
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/update",
  async ({ expenseId, data }: { expenseId: string; data: UpdateExpenseRequest }, { rejectWithValue }) => {
    try {
      return await expensesService.update(expenseId, data);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao atualizar despesa"));
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (expenseId: string, { rejectWithValue }) => {
    try {
      return await expensesService.delete(expenseId);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao excluir despesa"));
    }
  }
);

export const toggleParticipantPayment = createAsyncThunk(
  "expenses/toggleParticipantPayment",
  async ({ expenseId, participantId }: { expenseId: string; participantId: string }, { rejectWithValue }) => {
    try {
      return await expensesService.toggleParticipantPayment(expenseId, participantId);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao alternar pagamento"));
    }
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensesByActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpensesByActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchExpenseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        const newExpense: ExpenseListItem = {
          id: action.payload.id,
          name: action.payload.name,
          amountInCents: action.payload.amountInCents,
          participantsCount: action.payload.participants.length,
          payer: {
            userId: action.payload.payerId ?? "",
            name: action.payload.payerName ?? "",
          },
          createdAt: action.payload.createdAt,
        };
        state.items.unshift(newExpense);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.items.findIndex((i) => i.id === updated.id);
        if (idx !== -1) {
          state.items[idx] = {
            ...state.items[idx],
            name: updated.name,
            amountInCents: updated.amountInCents,
          };
        }
        if (state.current?.id === updated.id) {
          state.current = {
            ...state.current,
            name: updated.name,
            amountInCents: updated.amountInCents,
          };
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.items = state.items.filter((i) => i.id !== deletedId);
        if (state.current?.id === deletedId) {
          state.current = null;
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(toggleParticipantPayment.fulfilled, (state, action) => {
        const { expenseId, participantId, paymentStatus } = action.payload;
        if (state.current?.id === expenseId) {
          const participant = state.current.participants.find((p) => p.userId === participantId);
          if (participant) {
            participant.paymentStatus = paymentStatus;
            participant.amountPaidInCents = action.payload.amountPaidInCents;
            participant.remainingDebtInCents = action.payload.remainingDebtInCents;
          }
        }
      });
  },
});

export const { clearCurrent, clearError } = expensesSlice.actions;
export default expensesSlice.reducer;
