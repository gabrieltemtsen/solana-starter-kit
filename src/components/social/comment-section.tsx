'use client'

import { Heart, User } from 'lucide-react'
import { useGetComments } from '@/components/profile/hooks/use-get-comments'
import { useToggleLike } from './hooks/use-toggle-like'
import { formatDistanceToNow } from 'date-fns'
import { IComments } from '@/models/comment.models'

interface CommentSectionProps {
  contentId: number
  requestingProfileId: number | null
  onUpdate: () => void
}

export function CommentSection({ contentId, requestingProfileId, onUpdate }: CommentSectionProps) {
  const { data, loading, refetch } = useGetComments({
    contentId: contentId.toString(),
    requestingProfileId: requestingProfileId?.toString()
  })
  const { toggleLike } = useToggleLike()

  const handleLike = async (commentId: string, hasLiked: boolean) => {
    if (!requestingProfileId) return

    try {
      await toggleLike(parseInt(commentId), requestingProfileId, hasLiked)
      // Refetch comments to update like status
      refetch()
      onUpdate()
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  if (loading) {
    return <div className="text-center text-muted">Loading comments...</div>
  }

  const comments = data?.comments || []

  if (comments.length === 0) {
    return <div className="text-center text-muted">No replies yet. Be the first to reply!</div>
  }

  return (
    <div className="space-y-3">
      {comments.map((comment: IComments) => (
        <div key={comment.comment.id} className="border-l-2 border-muted-light pl-4 py-2">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full bg-muted-light flex items-center justify-center">
              {comment.author.image ? (
                <img 
                  src={comment.author.image} 
                  alt={comment.author.username} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={16} className="text-muted" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline space-x-2">
                <span className="font-medium text-sm">{comment.author.username}</span>
                <span className="text-xs text-muted">
                  · {formatDistanceToNow(new Date(comment.comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.comment.text}</p>
              <button
                onClick={() => handleLike(comment.comment.id, comment.requestingProfileSocialInfo?.hasLiked || false)}
                disabled={!requestingProfileId}
                className={`mt-2 flex items-center space-x-1 text-xs ${
                  comment.requestingProfileSocialInfo?.hasLiked ? 'text-red-500' : 'text-muted hover:text-foreground'
                }`}
              >
                <Heart 
                  size={14} 
                  className={comment.requestingProfileSocialInfo?.hasLiked ? 'fill-current' : ''}
                />
                <span>{comment.socialCounts?.likeCount || 0}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 