import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { activitiesService } from "../services";
import type {
  ActivityListItem,
  ActivityDetailResponse,
  CreateActivityRequest,
  UpdateActivityRequest,
} from "../services/types";

interface ActivitiesState {
  items: ActivityListItem[];
  current: ActivityDetailResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
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

export const fetchActivities = createAsyncThunk(
  "activities/fetchAll",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await activitiesService.listByUser(userId);
      return response.activities;
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar atividades"));
    }
  }
);

export const fetchActivityById = createAsyncThunk(
  "activities/fetchById",
  async (activityId: string, { rejectWithValue }) => {
    try {
      return await activitiesService.getById(activityId);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar atividade"));
    }
  }
);

export const createActivity = createAsyncThunk(
  "activities/create",
  async (data: CreateActivityRequest, { rejectWithValue }) => {
    try {
      return await activitiesService.create(data);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao criar atividade"));
    }
  }
);

export const updateActivity = createAsyncThunk(
  "activities/update",
  async ({ activityId, data }: { activityId: string; data: UpdateActivityRequest }, { rejectWithValue }) => {
    try {
      return await activitiesService.update(activityId, data);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao atualizar atividade"));
    }
  }
);

export const deleteActivity = createAsyncThunk(
  "activities/delete",
  async (activityId: string, { rejectWithValue }) => {
    try {
      return await activitiesService.delete(activityId);
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao excluir atividade"));
    }
  }
);

const activitiesSlice = createSlice({
  name: "activities",
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
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchActivityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchActivityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.items.findIndex((i) => i.id === updated.id);
        if (idx !== -1) {
          state.items[idx] = {
            ...state.items[idx],
            name: updated.name,
            activityDate: updated.activityDate,
          };
        }
        if (state.current?.id === updated.id) {
          state.current = {
            ...state.current,
            name: updated.name,
            activityDate: updated.activityDate,
          };
        }
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.items = state.items.filter((i) => i.id !== deletedId);
        if (state.current?.id === deletedId) {
          state.current = null;
        }
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrent, clearError } = activitiesSlice.actions;
export default activitiesSlice.reducer;
