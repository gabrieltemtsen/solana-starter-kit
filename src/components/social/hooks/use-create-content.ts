'use client'

import { useState } from 'react'

export function useCreateContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createContent = async (profileId: number, text: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          text,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create content')
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create content'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createContent, loading, error }
} 