import { api } from "./client";
import type { AdminInsights } from "../types";

export const fetchInsightsRequest = () =>
  api.get<AdminInsights>("/admin/insights");
