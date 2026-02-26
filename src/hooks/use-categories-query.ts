"use client";

import type { CategoriesQueryParams, Category } from "@/types/category";
import { usePaginatedQuery } from "./use-paginated-query";

export type { CategoriesQueryParams, Category } from "@/types/category";

export function useCategoriesQuery(query: CategoriesQueryParams) {
  return usePaginatedQuery<Category>({
    endpoint: "category",
    query,
    fallbackErrorMessage: "Não foi possível carregar categorias.",
  });
}
