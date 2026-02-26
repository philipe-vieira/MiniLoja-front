'use client'

import { useState } from 'react'
import { api, getApiErrorMessage } from '../lib/api'

export type CreateCategoryPayload = {
  name: string
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>

export function useCategoryMutations() {
  const [loading, setLoading] = useState(false)

  async function createCategory(payload: CreateCategoryPayload) {
    setLoading(true)

    try {
      const response = await api.post('/category', payload)
      return response.data
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Não foi possível criar a categoria.'))
    } finally {
      setLoading(false)
    }
  }

  async function updateCategory(id: number, payload: UpdateCategoryPayload) {
    setLoading(true)

    try {
      const response = await api.patch(`/category/${id}`, payload)
      return response.data
    } catch (error: unknown) {
      throw new Error(
        getApiErrorMessage(error, 'Não foi possível atualizar a categoria.'),
      )
    } finally {
      setLoading(false)
    }
  }

  async function deleteCategory(id: number) {
    setLoading(true)

    try {
      const response = await api.delete(`/category/${id}`)
      return response.data
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Não foi possível remover a categoria.'))
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}

