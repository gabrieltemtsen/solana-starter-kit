'use client'

import { Button } from '@/components/common/button'
import { cn } from '@/utils/utils'
import { Heart, LogIn } from 'lucide-react'
import { useState } from 'react'

interface LikeButtonProps {
  initialLikeCount: number
  initiallyLiked: boolean
  onLike: () => void
  onUnlike: () => void
  showLoginPrompt?: boolean
}

export function LikeButton({
  initialLikeCount,
  initiallyLiked,
  onLike,
  onUnlike,
  showLoginPrompt = false,
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [hasLiked, setHasLiked] = useState(initiallyLiked)

  const handleToggleLike = () => {
    if (showLoginPrompt) {
      onLike() // This will trigger the login flow
      return
    }

    if (hasLiked) {
      setLikeCount((prev) => Math.max(0, prev - 1))
      setHasLiked(false)
      onUnlike()
    } else {
      setLikeCount((prev) => prev + 1)
      setHasLiked(true)
      onLike()
    }
  }

  return (
    <div className="flex items-center space-x-1">
      <span className="text-sm text-gray-400">{likeCount}</span>
      <Button variant="ghost" onClick={handleToggleLike} className="p-1">
        {showLoginPrompt ? (
          <LogIn className="w-4 h-4 text-gray-400" />
        ) : (
          <Heart
            className={cn('w-4 h-4', {
              'fill-accent text-accent': hasLiked,
              'text-gray-400': !hasLiked,
            })}
          />
        )}
      </Button>
    </div>
  )
} 