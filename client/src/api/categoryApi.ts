import { api } from "./client";
import type { Category } from "../types";

export const fetchCategoriesRequest = () =>
  api.get<{ categories: Category[] }>("/categories");
