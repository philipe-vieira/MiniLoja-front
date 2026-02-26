'use client'

import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { api, getApiErrorMessage } from '../lib/api'
import {
  DEFAULT_META,
  type PaginatedResponse,
  type PaginationMeta,
} from '../lib/pagination'

type QueryParams = Record<string, string | number | undefined>

type UsePaginatedQueryInput = {
  endpoint: 'product' | 'category'
  query: QueryParams
  fallbackErrorMessage: string
}

type UsePaginatedQueryResult<T> = {
  data: T[]
  meta: PaginationMeta
  loading: boolean
  error: string
  refetch: () => void
}

export function usePaginatedQuery<T>({
  endpoint,
  query,
  fallbackErrorMessage,
}: UsePaginatedQueryInput): UsePaginatedQueryResult<T> {
  const [data, setData] = useState<T[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reloadTick, setReloadTick] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get<PaginatedResponse<T>>(`/${endpoint}`, {
        params: query,
      })

      setData(response.data.data)
      setMeta(response.data.meta)
    } catch (requestError: unknown) {
      if (axios.isCancel(requestError)) {
        return
      }

      setData([])
      setMeta(DEFAULT_META)
      setError(getApiErrorMessage(requestError, fallbackErrorMessage))
    } finally {
      setLoading(false)
    }
  }, [endpoint, fallbackErrorMessage, query])

  const refetch = useCallback(() => {
    setReloadTick((current) => current + 1)
  }, [])

  useEffect(() => {
    void load()
  }, [load, reloadTick])

  return { data, meta, loading, error, refetch }
}
