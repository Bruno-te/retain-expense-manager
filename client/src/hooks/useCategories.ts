import { useCallback, useEffect, useState } from "react";
import { fetchCategoriesRequest } from "../api/categoryApi";
import type { Category } from "../types";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchCategoriesRequest()
      .then(({ categories }) => {
        if (!cancelled) setCategories(categories);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load categories");
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return { categories, error, reload };
};
