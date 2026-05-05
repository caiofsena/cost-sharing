import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services";
import type { SignInRequest, SignUpRequest } from "../services/types";

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  loading: boolean;
  initialized: boolean;
  loginError: string | null;
  signupError: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  initialized: false,
  loginError: null,
  signupError: null,
};

export const checkStoredAuth = createAsyncThunk(
  "auth/checkStoredAuth",
  async () => {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) return { token: null, user: null };

    try {
      const profile = await authService.getProfile();
      return { token, user: { id: profile.id, email: profile.email, name: profile.name } };
    } catch {
      await AsyncStorage.removeItem("auth_token");
      return { token: null, user: null };
    }
  }
);

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

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (data: SignInRequest, { rejectWithValue }) => {
    try {
      const response = await authService.signIn(data);
      return {
        token: response.token,
        user: { id: response.id, email: response.email, name: response.name },
      };
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao fazer login"));
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (data: SignUpRequest, { rejectWithValue }) => {
    try {
      const response = await authService.signUp(data);
      return {
        token: response.token,
        user: { id: response.id, email: response.email, name: response.name },
      };
    } catch (err: any) {
      return rejectWithValue(extractErrorMessage(err, "Erro ao criar conta"));
    }
  }
);
export const signOut = createAsyncThunk("auth/signOut", async () => {
  await authService.signOut();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearLoginError: (state) => {
      state.loginError = null;
    },
    clearSignupError: (state) => {
      state.signupError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkStoredAuth.pending, (state) => {
        state.loading = true;
        state.loginError = null;
        state.signupError = null;
      })
      .addCase(checkStoredAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(checkStoredAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.token = null;
        state.user = null;
      })

      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload as string;
      })

      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.signupError = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.signupError = action.payload as string;
      })

      .addCase(signOut.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.loading = false;
        state.loginError = null;
        state.signupError = null;
      });
  },
});

export const { clearLoginError, clearSignupError } = authSlice.actions;
export default authSlice.reducer;
