'use client'

import { ICommentsResponse } from '@/models/comment.models'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  targetProfileId?: string
  requestingProfileId?: string
}

export const useGetComments = ({
  targetProfileId,
  requestingProfileId,
}: Props) => {
  const [data, setData] = useState<ICommentsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let url = '/api/comments'
      const params = new URLSearchParams()
      
      if (targetProfileId) {
        params.append('targetProfileId', targetProfileId)
      }
      if (requestingProfileId) {
        params.append('requestingProfileId', requestingProfileId)
      }

      const queryString = params.toString()
      if (queryString) {
        url += `?${queryString}`
      }

      const response = await fetch(url, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch comments')
      }

      setData(result)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [targetProfileId, requestingProfileId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return { data, loading, error, refetch: fetchComments }
}
