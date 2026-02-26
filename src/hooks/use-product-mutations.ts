'use client'

import { useState } from 'react'
import { api, getApiErrorMessage } from '../lib/api'

export type CreateProductPayload = {
  name: string
  description?: string
  price: number
  categoryId: number
}

export type UpdateProductPayload = Partial<CreateProductPayload>

export function useProductMutations() {
  const [loading, setLoading] = useState(false)

  async function createProduct(payload: CreateProductPayload) {
    setLoading(true)

    try {
      const response = await api.post('/product', payload)
      return response.data
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Não foi possível criar o produto.'))
    } finally {
      setLoading(false)
    }
  }

  async function updateProduct(id: number, payload: UpdateProductPayload) {
    setLoading(true)

    try {
      const response = await api.patch(`/product/${id}`, payload)
      return response.data
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Não foi possível atualizar o produto.'))
    } finally {
      setLoading(false)
    }
  }

  async function deleteProduct(id: number) {
    setLoading(true)

    try {
      const response = await api.delete(`/product/${id}`)
      return response.data
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Não foi possível remover o produto.'))
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

