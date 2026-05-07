import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { balanceService } from "../services";
import type {
  ActivityBalanceResponse,
  UserGlobalBalanceResponse,
  DetailedBalanceResponse,
  BalanceBetweenUsersResponse,
} from "../services/types";

interface BalanceState {
  activityBalance: ActivityBalanceResponse | null;
  globalBalance: UserGlobalBalanceResponse | null;
  detailedBalance: DetailedBalanceResponse | null;
  betweenUsers: BalanceBetweenUsersResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: BalanceState = {
  activityBalance: null,
  globalBalance: null,
  detailedBalance: null,
  betweenUsers: null,
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

export const fetchActivityBalance = createAsyncThunk(
  "balance/fetchActivity",
  async (activityId: string, { rejectWithValue }) => {
    try {
      return await balanceService.getActivityBalance(activityId);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar balanço da atividade"));
    }
  }
);

export const fetchGlobalBalance = createAsyncThunk(
  "balance/fetchGlobal",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await balanceService.getUserGlobalBalance(userId);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar balanço global"));
    }
  }
);

export const fetchDetailedBalance = createAsyncThunk(
  "balance/fetchDetailed",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await balanceService.getUserDetailedBalance(userId);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar balanço detalhado"));
    }
  }
);

export const fetchBalanceBetweenUsers = createAsyncThunk(
  "balance/fetchBetweenUsers",
  async ({ userId1, userId2 }: { userId1: string; userId2: string }, { rejectWithValue }) => {
    try {
      return await balanceService.getBalanceBetweenUsers(userId1, userId2);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar balanço entre usuários"));
    }
  }
);

const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.activityBalance = action.payload;
      })
      .addCase(fetchActivityBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchGlobalBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.globalBalance = action.payload;
      })
      .addCase(fetchGlobalBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchDetailedBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailedBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.detailedBalance = action.payload;
      })
      .addCase(fetchDetailedBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchBalanceBetweenUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceBetweenUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.betweenUsers = action.payload;
      })
      .addCase(fetchBalanceBetweenUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = balanceSlice.actions;
export default balanceSlice.reducer;
