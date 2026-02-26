"use client";

import type { Product, ProductsQueryParams } from "@/types/product";
import { usePaginatedQuery } from "./use-paginated-query";

export type { Product, ProductsQueryParams } from "@/types/product";

export function useProductsQuery(query: ProductsQueryParams) {
  return usePaginatedQuery<Product>({
    endpoint: "product",
    query,
    fallbackErrorMessage: "Não foi possível carregar produtos.",
  });
}
