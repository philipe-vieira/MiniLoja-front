export type Category = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export type CategoriesQueryParams = {
  page: number
  limit: number
  sort_by: string
  get_all?: string
  createdAt_gte?: string
  createdAt_lte?: string
  id?: string
  name?: string
}

