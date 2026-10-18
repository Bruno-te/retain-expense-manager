import { api } from "./client";
import type { DashboardData } from "../types";

export const fetchDashboardRequest = (month: string) =>
  api.get<DashboardData>(`/dashboard?month=${month}`);

export const saveBudgetRequest = (month: string, limit: number) =>
  api.put<{ month: string; limit: number }>("/budgets", { month, limit });
