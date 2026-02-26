'use client'

import { useCallback, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'
import {
  EntityModal,
  type EntityModalSubmitPayload,
} from '@/components/entity-modal'
import { useCategoriesQuery } from '@/hooks/use-categories-query'
import { useCategoryMutations } from '@/hooks/use-category-mutations'
import { useProductMutations } from '@/hooks/use-product-mutations'
import { useProductsQuery } from '@/hooks/use-products-query'
import type { SortDirection } from '@/lib/pagination'
import type { Category, CategoriesQueryParams } from '@/types/category'
import type { Product, ProductsQueryParams } from '@/types/product'
import {
  EMPTY_CATEGORY_FILTERS,
  EMPTY_PRODUCT_FILTERS,
  type CategoryFilters,
  type ModalState,
  type ProductFilters,
  type TabId,
} from '@/types/home'
import {
  createCategoryColumns,
  createProductColumns,
} from '@/components/home/columns'
import { CategorySection } from '@/components/home/category-section'
import { ProductSection } from '@/components/home/product-section'
import { dateInputToIso, valueOrUndefined } from '@/utils/query-params'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('products')
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    entity: 'product',
    mode: 'create',
    product: null,
    category: null,
  })

  const [productFilters, setProductFilters] = useState<ProductFilters>(
    EMPTY_PRODUCT_FILTERS,
  )
  const [productSort, setProductSort] = useState<{
    field: string
    direction: SortDirection
  }>({ field: 'id', direction: 'asc' })
  const [productPage, setProductPage] = useState(1)
  const [productLimit, setProductLimit] = useState(10)

  const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>(
    EMPTY_CATEGORY_FILTERS,
  )
  const [categorySort, setCategorySort] = useState<{
    field: string
    direction: SortDirection
  }>({ field: 'id', direction: 'asc' })
  const [categoryPage, setCategoryPage] = useState(1)
  const [categoryLimit, setCategoryLimit] = useState(10)

  const productQuery = useMemo<ProductsQueryParams>(
    () => ({
      page: productPage,
      limit: productLimit,
      sort_by: `${productSort.field}:${productSort.direction}`,
      createdAt_gte: dateInputToIso(productFilters.createdAtFrom),
      createdAt_lte: dateInputToIso(productFilters.createdAtTo),
      id: valueOrUndefined(productFilters.id),
      name: valueOrUndefined(productFilters.name),
      description: valueOrUndefined(productFilters.description),
      price_gte: valueOrUndefined(productFilters.priceMin),
      price_lte: valueOrUndefined(productFilters.priceMax),
      categoryId: valueOrUndefined(productFilters.categoryId),
    }),
    [productFilters, productLimit, productPage, productSort],
  )

  const categoryQuery = useMemo<CategoriesQueryParams>(
    () => ({
      page: categoryPage,
      limit: categoryLimit,
      sort_by: `${categorySort.field}:${categorySort.direction}`,
      createdAt_gte: dateInputToIso(categoryFilters.createdAtFrom),
      createdAt_lte: dateInputToIso(categoryFilters.createdAtTo),
      id: valueOrUndefined(categoryFilters.id),
      name: valueOrUndefined(categoryFilters.name),
    }),
    [categoryFilters, categoryLimit, categoryPage, categorySort],
  )

  const categoryLookupQuery = useMemo<CategoriesQueryParams>(
    () => ({
      page: 1,
      limit: 100,
      get_all: 'true',
      sort_by: 'id:asc',
    }),
    [],
  )

  const {
    data: productData,
    meta: productMeta,
    loading: productLoading,
    error: productError,
    refetch: refetchProducts,
  } = useProductsQuery(productQuery)

  const {
    data: categoryData,
    meta: categoryMeta,
    loading: categoryLoading,
    error: categoryError,
    refetch: refetchCategories,
  } = useCategoriesQuery(categoryQuery)

  const { data: categoryLookupData, refetch: refetchCategoryLookup } =
    useCategoriesQuery(categoryLookupQuery)

  const {
    loading: productMutationLoading,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductMutations()
  const {
    loading: categoryMutationLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryMutations()

  const activeError = activeTab === 'products' ? productError : categoryError
  const categoryNameById = useMemo(
    () =>
      new Map(
        categoryLookupData.map((category) => [category.id, category.name]),
      ),
    [categoryLookupData],
  )

  const updateProductFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setProductPage(1)
      setProductFilters((previous) => ({ ...previous, [key]: value }))
    },
    [],
  )

  const updateCategoryFilter = useCallback(
    <K extends keyof CategoryFilters>(key: K, value: CategoryFilters[K]) => {
      setCategoryPage(1)
      setCategoryFilters((previous) => ({ ...previous, [key]: value }))
    },
    [],
  )

  const openCreateModal = useCallback(() => {
    setModalState({
      open: true,
      entity: activeTab === 'products' ? 'product' : 'category',
      mode: 'create',
      product: null,
      category: null,
    })
  }, [activeTab])

  const openEditProductModal = useCallback((product: Product) => {
    setModalState({
      open: true,
      entity: 'product',
      mode: 'update',
      product,
      category: null,
    })
  }, [])

  const openEditCategoryModal = useCallback((category: Category) => {
    setModalState({
      open: true,
      entity: 'category',
      mode: 'update',
      product: null,
      category,
    })
  }, [])

  const handleDeleteProduct = useCallback(
    async (item: Product) => {
      const confirmed = window.confirm(
        `Deseja remover o produto "${item.name}"?`,
      )
      if (!confirmed) {
        return
      }

      try {
        await deleteProduct(item.id)
        toast.success('Produto removido com sucesso.')
        refetchProducts()
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : 'Falha ao remover produto.',
        )
      }
    },
    [deleteProduct, refetchProducts],
  )

  const handleDeleteCategory = useCallback(
    async (item: Category) => {
      const confirmed = window.confirm(
        `Deseja remover a categoria "${item.name}"?`,
      )
      if (!confirmed) {
        return
      }

      try {
        await deleteCategory(item.id)
        toast.success('Categoria removida com sucesso.')
        refetchCategories()
        refetchCategoryLookup()
        refetchProducts()
      } catch (error: unknown) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Falha ao remover categoria.',
        )
      }
    },
    [deleteCategory, refetchCategories, refetchCategoryLookup, refetchProducts],
  )

  const handleModalSubmit = useCallback(
    async (payload: EntityModalSubmitPayload) => {
      if (payload.entity === 'product') {
        if (payload.mode === 'create') {
          await createProduct(payload.data)
          toast.success('Produto criado com sucesso.')
        } else {
          await updateProduct(payload.id ?? 0, payload.data)
          toast.success('Produto atualizado com sucesso.')
        }

        setModalState((current) => ({ ...current, open: false }))
        refetchProducts()
        return
      }

      if (payload.mode === 'create') {
        await createCategory(payload.data)
        toast.success('Categoria criada com sucesso.')
      } else {
        await updateCategory(payload.id ?? 0, payload.data)
        toast.success('Categoria atualizada com sucesso.')
      }

      setModalState((current) => ({ ...current, open: false }))
      refetchCategories()
      refetchCategoryLookup()
      refetchProducts()
    },
    [
      createCategory,
      createProduct,
      refetchCategories,
      refetchCategoryLookup,
      refetchProducts,
      updateCategory,
      updateProduct,
    ],
  )

  const productColumns = useMemo(
    () =>
      createProductColumns({
        categoryNameById,
        onEdit: openEditProductModal,
        onDelete: (item) => void handleDeleteProduct(item),
      }),
    [categoryNameById, handleDeleteProduct, openEditProductModal],
  )

  const categoryColumns = useMemo(
    () =>
      createCategoryColumns({
        onEdit: openEditCategoryModal,
        onDelete: (item) => void handleDeleteCategory(item),
      }),
    [handleDeleteCategory, openEditCategoryModal],
  )

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900">Miniloja</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Listagem com filtros, ordenação e paginação.
          </p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-3">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === 'products'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('category')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === 'category'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Category
              </button>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>

          {activeError ? (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {activeError}
            </div>
          ) : null}

          {activeTab === 'products' ? (
            <ProductSection
              filters={productFilters}
              categoryOptions={categoryLookupData}
              columns={productColumns}
              rows={productData}
              loading={productLoading}
              sortField={productSort.field}
              sortDirection={productSort.direction}
              meta={productMeta}
              limit={productLimit}
              onSort={(field) => {
                setProductPage(1)
                setProductSort((previous) => ({
                  field,
                  direction:
                    previous.field === field && previous.direction === 'asc'
                      ? 'desc'
                      : 'asc',
                }))
              }}
              onLimitChange={(value) => {
                setProductPage(1)
                setProductLimit(value)
              }}
              onPageChange={setProductPage}
              onFilterChange={updateProductFilter}
              onClearFilters={() => {
                setProductPage(1)
                setProductFilters(EMPTY_PRODUCT_FILTERS)
              }}
            />
          ) : (
            <CategorySection
              filters={categoryFilters}
              columns={categoryColumns}
              rows={categoryData}
              loading={categoryLoading}
              sortField={categorySort.field}
              sortDirection={categorySort.direction}
              meta={categoryMeta}
              limit={categoryLimit}
              onSort={(field) => {
                setCategoryPage(1)
                setCategorySort((previous) => ({
                  field,
                  direction:
                    previous.field === field && previous.direction === 'asc'
                      ? 'desc'
                      : 'asc',
                }))
              }}
              onLimitChange={(value) => {
                setCategoryPage(1)
                setCategoryLimit(value)
              }}
              onPageChange={setCategoryPage}
              onFilterChange={updateCategoryFilter}
              onClearFilters={() => {
                setCategoryPage(1)
                setCategoryFilters(EMPTY_CATEGORY_FILTERS)
              }}
            />
          )}
        </section>
      </div>

      <EntityModal
        key={`${modalState.entity}-${modalState.mode}-${modalState.product?.id ?? ''}-${modalState.category?.id ?? ''}-${modalState.open ? 'open' : 'closed'}`}
        open={modalState.open}
        entity={modalState.entity}
        mode={modalState.mode}
        product={modalState.product}
        category={modalState.category}
        categories={categoryLookupData}
        submitting={productMutationLoading || categoryMutationLoading}
        onClose={() =>
          setModalState((current) => ({ ...current, open: false }))
        }
        onSubmit={handleModalSubmit}
      />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </main>
  )
}
