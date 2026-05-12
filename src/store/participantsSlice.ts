import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { participantsService } from "@/services";
import type { ActivityParticipantsResponseParticipantsInfo, AddParticipantsRequest } from "@/services/types";

interface ParticipantsState {
  items: ActivityParticipantsResponseParticipantsInfo[];
  activityName: string;
  loading: boolean;
  error: string | null;
}

const initialState: ParticipantsState = {
  items: [],
  activityName: "",
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

export const fetchParticipants = createAsyncThunk(
  "participants/fetch",
  async (activityId: string, { rejectWithValue }) => {
    try {
      const response = await participantsService.list(activityId);
      return {
        items: response.participants,
        activityName: response.activityName,
      };
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao buscar participantes"));
    }
  },
);

export const addParticipants = createAsyncThunk(
  "participants/add",
  async ({ activityId, data }: { activityId: string; data: AddParticipantsRequest }, { rejectWithValue }) => {
    try {
      return await participantsService.add(activityId, data);
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao adicionar participantes"));
    }
  },
);

export const removeParticipant = createAsyncThunk(
  "participants/remove",
  async ({ activityId, userId }: { activityId: string; userId: string }, { rejectWithValue }) => {
    try {
      return await participantsService.remove(activityId, userId);
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao remover participante"));
    }
  },
);

const participantsSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.activityName = action.payload.activityName;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addParticipants.fulfilled, (state, action) => {
        state.loading = false;
        const added = action.payload.addedParticipants;
        for (const p of added) {
          const exists = state.items.some((i) => i.userId === p.userId);
          if (!exists) {
            state.items.push({
              userId: p.userId,
              email: p.email,
              name: p.name,
              joinedAt: p.joinedAt,
            });
          }
        }
      })
      .addCase(addParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(removeParticipant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeParticipant.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload.removedUserId;
        state.items = state.items.filter((i) => i.userId !== removedId);
      })
      .addCase(removeParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = participantsSlice.actions;
export default participantsSlice.reducer;
