import { DataTable, type DataTableColumn } from '@/components/data-table'
import type { PaginationMeta, SortDirection } from '@/lib/pagination'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import type { ProductFilters } from '@/types/home'

type ProductSectionProps = {
  filters: ProductFilters
  categoryOptions: Category[]
  columns: DataTableColumn<Product>[]
  rows: Product[]
  loading: boolean
  sortField: string
  sortDirection: SortDirection
  meta: PaginationMeta
  limit: number
  onSort: (field: string) => void
  onLimitChange: (value: number) => void
  onPageChange: (page: number) => void
  onFilterChange: <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) => void
  onClearFilters: () => void
}

export function ProductSection({
  filters,
  categoryOptions,
  columns,
  rows,
  loading,
  sortField,
  sortDirection,
  meta,
  limit,
  onSort,
  onLimitChange,
  onPageChange,
  onFilterChange,
  onClearFilters,
}: ProductSectionProps) {
  return (
    <div className="space-y-4">
      <form className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          ID
          <input
            value={filters.id}
            onChange={(event) => onFilterChange('id', event.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Ex: 1"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          Nome
          <input
            value={filters.name}
            onChange={(event) => onFilterChange('name', event.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Ex: Keyboard"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          Descrição
          <input
            value={filters.description}
            onChange={(event) => onFilterChange('description', event.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Ex: RGB"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          Preço mín.
          <input
            type="number"
            step="0.01"
            min="0"
            value={filters.priceMin}
            onChange={(event) => onFilterChange('priceMin', event.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Ex: 10"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          Preço máx.
          <input
            type="number"
            step="0.01"
            min="0"
            value={filters.priceMax}
            onChange={(event) => onFilterChange('priceMax', event.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Ex: 1000"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          Categoria
          <select
            value={filters.categoryId}
            onChange={(event) => onFilterChange('categoryId', event.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm outline-none focus:border-zinc-500"
          >
            <option value="">Todas</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          Criado em (de)
          <input
            type="datetime-local"
            value={filters.createdAtFrom}
            onChange={(event) => onFilterChange('createdAtFrom', event.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          Criado em (até)
          <input
            type="datetime-local"
            value={filters.createdAtTo}
            onChange={(event) => onFilterChange('createdAtTo', event.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </label>
        <div className="flex items-end gap-2 md:col-span-3">
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
          >
            Limpar
          </button>
        </div>
      </form>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyMessage="Nenhum produto encontrado."
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />

      <div className="flex items-center justify-between text-sm text-zinc-600">
        <div className="flex items-center gap-4">
          <span>
            Página {meta.page} de {meta.totalPages || 1} | Total: {meta.total}
          </span>
          <label className="flex items-center gap-2">
            <span>Itens por página:</span>
            <select
              value={limit}
              onChange={(event) => onLimitChange(Number(event.target.value))}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!meta.hasPreviousPage || loading}
            onClick={() => onPageChange(Math.max(1, meta.page - 1))}
            className="rounded-md border border-zinc-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={!meta.hasNextPage || loading}
            onClick={() => onPageChange(meta.page + 1)}
            className="rounded-md border border-zinc-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  )
}
