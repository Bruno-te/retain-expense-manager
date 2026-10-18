import { api } from "./client";
import type {
  Expense,
  ExpenseFilters,
  ExpenseInput,
  PaginatedExpenses,
} from "../types";

// The filter keys match the query parameter names the server expects
const buildQuery = (filters: ExpenseFilters): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "") params.set(key, String(value));
  });
  return params.toString();
};

export const fetchExpensesRequest = (filters: ExpenseFilters) =>
  api.get<PaginatedExpenses>(`/expenses?${buildQuery(filters)}`);

export const getExpenseRequest = (id: string) =>
  api.get<{ expense: Expense }>(`/expenses/${id}`);

export const createExpenseRequest = (input: ExpenseInput) =>
  api.post<{ expense: Expense }>("/expenses", input);

export const updateExpenseRequest = (id: string, input: ExpenseInput) =>
  api.put<{ expense: Expense }>(`/expenses/${id}`, input);

export const deleteExpenseRequest = (id: string) =>
  api.delete<{ message: string }>(`/expenses/${id}`);
