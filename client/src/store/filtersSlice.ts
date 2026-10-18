import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ExpenseFilters,
  PaymentMethod,
  SortField,
  SortOrder,
} from "../types";

export const initialFilters: ExpenseFilters = {
  search: "",
  category: "",
  paymentMethod: "",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  sortBy: "date",
  order: "desc",
  page: 1,
  limit: 10,
};

// Changing any filter or the sort sends the user back to page 1, otherwise
// they could be left on page 4 of a result set that now only has 2 pages.
const filtersSlice = createSlice({
  name: "filters",
  initialState: initialFilters,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.page = 1;
    },
    setPaymentMethod(state, action: PayloadAction<PaymentMethod | "">) {
      state.paymentMethod = action.payload;
      state.page = 1;
    },
    setDateRange(
      state,
      action: PayloadAction<{ startDate: string; endDate: string }>
    ) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.page = 1;
    },
    setAmountRange(
      state,
      action: PayloadAction<{ minAmount: string; maxAmount: string }>
    ) {
      state.minAmount = action.payload.minAmount;
      state.maxAmount = action.payload.maxAmount;
      state.page = 1;
    },
    setSort(
      state,
      action: PayloadAction<{ sortBy: SortField; order: SortOrder }>
    ) {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters: () => initialFilters,
  },
});

export const {
  setSearch,
  setCategory,
  setPaymentMethod,
  setDateRange,
  setAmountRange,
  setSort,
  setPage,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
