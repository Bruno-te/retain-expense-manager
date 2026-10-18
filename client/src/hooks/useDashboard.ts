import { useCallback, useEffect, useState } from "react";
import { fetchDashboardRequest } from "../api/dashboardApi";
import { ApiError } from "../api/client";
import type { DashboardData } from "../types";

export const useDashboard = (month: string) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDashboardRequest(month)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Could not load dashboard"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [month, version]);

  // Bumping the version re-runs the effect, e.g. after saving a budget
  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return { data, error, loading, reload };
};
