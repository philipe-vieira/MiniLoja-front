export type Product = {
  id: number
  name: string
  description: string | null
  price: number
  categoryId: number
  createdAt: string
  updatedAt: string
}

export type ProductsQueryParams = {
  page: number
  limit: number
  sort_by: string
  createdAt_gte?: string
  createdAt_lte?: string
  id?: string
  name?: string
  description?: string
  price_gte?: string
  price_lte?: string
  categoryId?: string
}

