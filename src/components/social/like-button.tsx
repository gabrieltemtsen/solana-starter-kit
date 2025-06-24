'use client'

import { Button } from '@/components/common/button'
import { cn } from '@/utils/utils'
import { Heart } from 'lucide-react'
import { useState } from 'react'

interface LikeButtonProps {
  initialLikeCount: number
  initiallyLiked: boolean
  onLike: () => void
  onUnlike: () => void
}

export function LikeButton({
  initialLikeCount,
  initiallyLiked,
  onLike,
  onUnlike,
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [hasLiked, setHasLiked] = useState(initiallyLiked)

  const handleToggleLike = () => {
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
        <Heart
          className={cn('w-4 h-4', {
            'fill-accent text-accent': hasLiked,
            'text-gray-400': !hasLiked,
          })}
        />
      </Button>
    </div>
  )
} 