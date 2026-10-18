import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./filtersSlice";
import expensesReducer from "./expensesSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    expenses: expensesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
