'use client'

import { useState } from 'react'
import { Heart, MessageCircle, User } from 'lucide-react'
import { Button } from '@/components/common/button'
import { CommentSection } from './comment-section'
import { CommentInput } from './comment-input'
import { useToggleLike } from './hooks/use-toggle-like'
import { useCreateComment } from '@/components/profile/hooks/use-create-comment'
import { formatDistanceToNow } from 'date-fns'
import type { Content } from './hooks/use-get-contents'

interface PostItemProps {
  post: Content
  currentProfileId: number | null
  onUpdate: () => void
}

export function PostItem({ post, currentProfileId, onUpdate }: PostItemProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const { toggleLike, loading: likeLoading } = useToggleLike()
  const { createComment, loading: commentLoading } = useCreateComment()

  const handleLike = async () => {
    if (!currentProfileId) return

    try {
      await toggleLike(post.id, currentProfileId, post.hasLiked)
      onUpdate()
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const handleComment = async () => {
    if (!currentProfileId || !commentText.trim()) return

    try {
      await createComment({
        profileId: currentProfileId.toString(),
        contentId: post.id.toString(),
        text: commentText.trim(),
      })
      setCommentText('')
      onUpdate()
    } catch (error) {
      console.error('Failed to create comment:', error)
    }
  }

  return (
    <div className="border border-muted-light rounded-lg p-4 space-y-4">
      {/* Post Header */}
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-muted-light flex items-center justify-center">
          {post.profile?.pfp ? (
            <img 
              src={post.profile.pfp} 
              alt={post.profile.nickname} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={20} className="text-muted" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline space-x-2">
            <span className="font-medium">{post.profile?.nickname || 'Anonymous'}</span>
            <span className="text-sm text-muted">
              · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          {post.profile?.bio && (
            <p className="text-sm text-muted">{post.profile.bio}</p>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="pl-13">
        <p className="whitespace-pre-wrap">{post.text}</p>
      </div>

      {/* Post Actions */}
      <div className="pl-13 flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={handleLike}
          disabled={likeLoading || !currentProfileId}
          className={`flex items-center space-x-1 px-3 py-1 ${
            post.hasLiked ? 'text-red-500' : 'text-muted hover:text-foreground'
          }`}
        >
          <Heart 
            size={18} 
            className={post.hasLiked ? 'fill-current' : ''}
          />
          <span>{post.likeCount}</span>
        </Button>

        <Button
          variant="ghost"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-muted hover:text-foreground px-3 py-1"
        >
          <MessageCircle size={18} />
          <span>Reply</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="pl-13 space-y-4">
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            handleSubmit={handleComment}
            loading={commentLoading}
            isAuthed={!!currentProfileId}
          />
          <CommentSection
            contentId={post.id}
            requestingProfileId={currentProfileId}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </div>
  )
} 