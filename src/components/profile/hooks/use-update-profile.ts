'use client'

import { IProfile } from '@/models/profile.models'
import { useCallback, useState } from 'react'

interface Props {
  username: string
}

export const useUpdateProfileInfo = ({ username }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const updateProfile = useCallback(async (profileData: Partial<IProfile>) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/profiles/info?username=${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile')
      }

      setSuccess(true)
      return result
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [username])

  return { updateProfile, loading, error, success }
}
