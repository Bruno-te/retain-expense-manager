import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchExpensesRequest } from "../api/expenseApi";
import { ApiError } from "../api/client";
import type { Expense, ExpenseFilters, PaginatedExpenses } from "../types";

interface ExpensesState {
  items: Expense[];
  total: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentRequestId: string | null;
}

const initialState: ExpensesState = {
  items: [],
  total: 0,
  totalPages: 1,
  status: "idle",
  error: null,
  currentRequestId: null,
};

// The thunk reads the filters straight from the store, so the filter state is
// the single source of truth for what gets requested.
export const fetchExpenses = createAsyncThunk<
  PaginatedExpenses,
  void,
  { state: { filters: ExpenseFilters }; rejectValue: string }
>("expenses/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    return await fetchExpensesRequest(getState().filters);
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError ? error.message : "Could not load expenses"
    );
  }
});

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        // Ignore a slow, outdated response that arrives after a newer request
        if (state.currentRequestId !== action.meta.requestId) return;
        state.items = action.payload.expenses;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.status = "succeeded";
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Could not load expenses";
      });
  },
});

export default expensesSlice.reducer;
