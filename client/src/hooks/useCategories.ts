import { useEffect, useState } from "react";
import { fetchCategoriesRequest } from "../api/categoryApi";
import type { Category } from "../types";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  return { categories, error };
};
