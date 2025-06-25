'use client'

import { useState, useEffect } from 'react'

export interface Content {
  id: number
  profileId: number
  text: string
  title?: string
  createdAt: string
  updatedAt: string
  likeCount: number
  hasLiked: boolean
  profile?: {
    id: number
    nickname: string
    bio?: string
    pfp?: string
  }
}

export function useGetContents(requestingProfileId: number | null) {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (requestingProfileId) {
        params.append('requestingProfileId', requestingProfileId.toString())
      }
      
      const response = await fetch(`/api/contents?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch contents')
      }
      
      const data = await response.json()
      setContents(data.contents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [requestingProfileId])

  return { contents, loading, error, refetch: fetchContents }
} 