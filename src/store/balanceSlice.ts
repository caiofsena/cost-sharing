import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { balanceService, authService } from "@/services";
import type {
  ActivityBalanceResponse,
  UserGlobalBalanceResponse,
  DetailedBalanceResponse,
  BalanceBetweenUsersResponse,
  UserExpenseStatisticsResponse,
} from "@/services/types";

interface BalanceState {
  activityBalance: ActivityBalanceResponse | null;
  globalBalance: UserGlobalBalanceResponse | null;
  detailedBalance: DetailedBalanceResponse | null;
  betweenUsers: BalanceBetweenUsersResponse | null;
  statistics: UserExpenseStatisticsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: BalanceState = {
  activityBalance: null,
  globalBalance: null,
  detailedBalance: null,
  betweenUsers: null,
  statistics: null,
  loading: false,
  error: null,
};

function extractErrorMessage(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object" && "reason" in data) return (data as { reason: string }).reason;
  if (data && typeof data === "object" && "message" in data) return (data as { message: string }).message;
  if (data && typeof data === "object" && "error" in data) return (data as { error: string }).error;
  if (
    data &&
    typeof data === "object" &&
    "errors" in data &&
    Array.isArray((data as { errors: unknown }).errors) &&
    (data as { errors: string[] }).errors.length > 0
  )
    return (data as { errors: string[] }).errors[0];
  if (err && typeof err === "object" && "message" in err) return (err as { message: string }).message;
  return fallback;
}

export const fetchActivityBalance = createAsyncThunk(
  "balance/fetchActivity",
  async (activityId: string, { rejectWithValue }) => {
    try {
      return await balanceService.getActivityBalance(activityId);
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar balanço da atividade"));
    }
  },
);

export const fetchGlobalBalance = createAsyncThunk(
  "balance/fetchGlobal",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await balanceService.getUserGlobalBalance(userId);
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar balanço global"));
    }
  },
);

export const fetchDetailedBalance = createAsyncThunk(
  "balance/fetchDetailed",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await balanceService.getUserDetailedBalance(userId);
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar balanço detalhado"));
    }
  },
);

export const fetchBalanceBetweenUsers = createAsyncThunk(
  "balance/fetchBetweenUsers",
  async ({ userId1, userId2 }: { userId1: string; userId2: string }, { rejectWithValue }) => {
    try {
      return await balanceService.getBalanceBetweenUsers(userId1, userId2);
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar balanço entre usuários"));
    }
  },
);

export const fetchUserStatistics = createAsyncThunk("balance/fetchStatistics", async (_, { rejectWithValue }) => {
  try {
    return await authService.getStatistics();
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Erro ao buscar estatísticas"));
  }
});

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
      })

      .addCase(fetchUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = balanceSlice.actions;
export default balanceSlice.reducer;
