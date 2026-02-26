import { Pencil, Trash2 } from 'lucide-react'
import type { DataTableColumn } from '@/components/data-table'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import { formatDate, formatPrice } from '../../utils/formatters'

type ProductColumnsInput = {
  categoryNameById: Map<number, string>
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

type CategoryColumnsInput = {
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function createProductColumns({
  categoryNameById,
  onEdit,
  onDelete,
}: ProductColumnsInput): DataTableColumn<Product>[] {
  return [
    { id: 'id', label: 'ID', sortable: true, render: (row) => row.id },
    { id: 'name', label: 'Nome', sortable: true, render: (row) => row.name },
    {
      id: 'description',
      label: 'Descrição',
      render: (row) => row.description ?? '-',
    },
    {
      id: 'price',
      label: 'Preço',
      sortable: true,
      render: (row) => formatPrice(row.price),
    },
    {
      id: 'categoryId',
      label: 'Categoria',
      sortable: true,
      render: (row) =>
        categoryNameById.get(row.categoryId) ?? `#${row.categoryId}`,
    },
    {
      id: 'createdAt',
      label: 'Criado em',
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: 'actions',
      label: 'Ações',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="rounded-md border border-zinc-300 p-1.5 text-zinc-600 hover:bg-zinc-100"
            aria-label="Alterar produto"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
            aria-label="Deletar produto"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]
}

export function createCategoryColumns({
  onEdit,
  onDelete,
}: CategoryColumnsInput): DataTableColumn<Category>[] {
  return [
    { id: 'id', label: 'ID', sortable: true, render: (row) => row.id },
    { id: 'name', label: 'Nome', sortable: true, render: (row) => row.name },
    {
      id: 'createdAt',
      label: 'Criado em',
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: 'updatedAt',
      label: 'Atualizado em',
      sortable: true,
      render: (row) => formatDate(row.updatedAt),
    },
    {
      id: 'actions',
      label: 'Ações',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="rounded-md border border-zinc-300 p-1.5 text-zinc-600 hover:bg-zinc-100"
            aria-label="Alterar categoria"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
            aria-label="Deletar categoria"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]
}
