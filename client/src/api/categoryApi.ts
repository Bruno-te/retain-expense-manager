import { api } from "./client";
import type { Category } from "../types";

export const fetchCategoriesRequest = () =>
  api.get<{ categories: Category[] }>("/categories");

export const createCategoryRequest = (name: string) =>
  api.post<{ category: Category }>("/categories", { name });

export const updateCategoryRequest = (id: string, name: string) =>
  api.put<{ category: Category }>(`/categories/${id}`, { name });

export const deleteCategoryRequest = (id: string) =>
  api.delete<{ message: string; reassignedExpenses: number }>(
    `/categories/${id}`
  );
