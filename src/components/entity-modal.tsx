'use client'

import { useMemo, useState } from 'react'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'

export type ModalEntity = 'product' | 'category'
export type ModalMode = 'create' | 'update'

export type EntityModalSubmitPayload =
  | {
      entity: 'product'
      mode: ModalMode
      id?: number
      data: {
        name: string
        description: string
        price: number
        categoryId: number
      }
    }
  | {
      entity: 'category'
      mode: ModalMode
      id?: number
      data: {
        name: string
      }
    }

type EntityModalProps = {
  open: boolean
  entity: ModalEntity
  mode: ModalMode
  categories: Category[]
  product?: Product | null
  category?: Category | null
  submitting: boolean
  onClose: () => void
  onSubmit: (payload: EntityModalSubmitPayload) => Promise<void>
}

type FormState = {
  name: string
  description: string
  price: string
  categoryId: string
}

function buildInitialState(
  entity: ModalEntity,
  product: Product | null | undefined,
  category: Category | null | undefined,
): FormState {
  if (entity === 'product') {
    return {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product ? String(product.price) : '',
      categoryId: product ? String(product.categoryId) : '',
    }
  }

  return {
    name: category?.name ?? '',
    description: '',
    price: '',
    categoryId: '',
  }
}

export function EntityModal({
  open,
  entity,
  mode,
  categories,
  product,
  category,
  submitting,
  onClose,
  onSubmit,
}: EntityModalProps) {
  const [formState, setFormState] = useState<FormState>(
    buildInitialState(entity, product, category),
  )
  const [error, setError] = useState('')

  const title = useMemo(() => {
    const action = mode === 'create' ? 'Adicionar' : 'Alterar'
    return entity === 'product' ? `${action} Produto` : `${action} Categoria`
  }, [entity, mode])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-950/30 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100"
          >
            Fechar
          </button>
        </div>

        <form
          className="space-y-3"
          onSubmit={async (event) => {
            event.preventDefault()
            setError('')

            if (!formState.name.trim()) {
              setError('Nome é obrigatório.')
              return
            }

            try {
              if (entity === 'product') {
                const parsedPrice = Number(formState.price)
                const parsedCategoryId = Number(formState.categoryId)

                if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
                  setError('Preço deve ser maior que zero.')
                  return
                }

                if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
                  setError('Selecione uma categoria válida.')
                  return
                }

                await onSubmit({
                  entity: 'product',
                  mode,
                  id: product?.id,
                  data: {
                    name: formState.name.trim(),
                    description: formState.description.trim(),
                    price: parsedPrice,
                    categoryId: parsedCategoryId,
                  },
                })

                return
              }

              await onSubmit({
                entity: 'category',
                mode,
                id: category?.id,
                data: {
                  name: formState.name.trim(),
                },
              })
            } catch (submitError: unknown) {
              setError(
                submitError instanceof Error
                  ? submitError.message
                  : 'Não foi possível salvar os dados.',
              )
            }
          }}
        >
          <label className="flex flex-col gap-1 text-xs text-zinc-600">
            Nome
            <input
              value={formState.name}
              onChange={(event) =>
                setFormState((current) => ({ ...current, name: event.target.value }))
              }
              className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </label>

          {entity === 'product' ? (
            <>
              <label className="flex flex-col gap-1 text-xs text-zinc-600">
                Descrição
                <input
                  value={formState.description}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-zinc-600">
                Preço
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formState.price}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, price: event.target.value }))
                  }
                  className="rounded-md border border-zinc-300 px-2 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-zinc-600">
                Categoria
                <select
                  value={formState.categoryId}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      categoryId: event.target.value,
                    }))
                  }
                  className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm outline-none focus:border-zinc-500"
                >
                  <option value="">Selecione</option>
                  {categories.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : null}

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
