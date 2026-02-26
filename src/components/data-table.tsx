import { ArrowUpDown } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type SortDirection = 'asc' | 'desc'

export type DataTableColumn<T> = {
  id: string
  label: string
  sortable?: boolean
  className?: string
  render: (row: T) => ReactNode
}

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  loading: boolean
  emptyMessage: string
  sortField: string
  sortDirection: SortDirection
  onSort: (field: string) => void
}

export function DataTable<T>({
  columns,
  rows,
  loading,
  emptyMessage,
  sortField,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <Table>
        <TableHeader className="bg-zinc-50">
          <TableRow>
            {columns.map((column) => {
              const isActive = sortField === column.id

              return (
                <TableHead key={column.id} className={column.className}>
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.id)}
                      className="inline-flex items-center gap-2 hover:text-zinc-900"
                    >
                      <span>{column.label}</span>
                      <span className={isActive ? 'text-zinc-900' : 'text-zinc-300'}>
                        {isActive ? (sortDirection === 'asc' ? '↑' : '↓') : <ArrowUpDown size={14} />}
                      </span>
                    </button>
                  ) : (
                    <span>{column.label}</span>
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-zinc-500"
                >
                  Carregando dados...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-zinc-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.className}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
        </TableBody>
      </Table>
    </div>
  )
}
