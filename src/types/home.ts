import type { Category } from './category'
import type { Product } from './product'

export type TabId = 'products' | 'category'

export type ProductFilters = {
  id: string
  name: string
  description: string
  priceMin: string
  priceMax: string
  categoryId: string
  createdAtFrom: string
  createdAtTo: string
}

export type CategoryFilters = {
  id: string
  name: string
  createdAtFrom: string
  createdAtTo: string
}

export type ModalState = {
  open: boolean
  entity: 'product' | 'category'
  mode: 'create' | 'update'
  product: Product | null
  category: Category | null
}

export const EMPTY_PRODUCT_FILTERS: ProductFilters = {
  id: '',
  name: '',
  description: '',
  priceMin: '',
  priceMax: '',
  categoryId: '',
  createdAtFrom: '',
  createdAtTo: '',
}

export const EMPTY_CATEGORY_FILTERS: CategoryFilters = {
  id: '',
  name: '',
  createdAtFrom: '',
  createdAtTo: '',
}

