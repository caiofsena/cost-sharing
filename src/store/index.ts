import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import activitiesReducer from "./activitiesSlice";
import expensesReducer from "./expensesSlice";
import participantsReducer from "./participantsSlice";
import balanceReducer from "./balanceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activities: activitiesReducer,
    expenses: expensesReducer,
    participants: participantsReducer,
    balance: balanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
