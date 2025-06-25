'use client'

import { useState } from 'react'

export function useToggleLike() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleLike = async (nodeId: number, startId: number, isLiked: boolean) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/likes', {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId,
          startId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? 'remove' : 'add'} like`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle like'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { toggleLike, loading, error }
} 