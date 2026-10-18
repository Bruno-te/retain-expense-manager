import { useCallback, useEffect, useState } from "react";
import { fetchInsightsRequest } from "../api/adminApi";
import { ApiError } from "../api/client";
import type { AdminInsights } from "../types";

export const useAdminInsights = () => {
  const [data, setData] = useState<AdminInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchInsightsRequest()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Could not load insights"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return { data, error, loading, reload };
};
