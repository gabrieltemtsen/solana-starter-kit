'use client'

import { Card } from '@/components/common/card'
import { IComments } from '@/models/comment.models'
import { formatRelativeTime } from '@/utils/utils'
import { MessageCircle, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { LikeButton } from './like-button'

interface CommentListProps {
  comments: IComments[]
  handleLike: (id: string) => void
  handleUnlike: (id: string) => void
  onReply: (comment: IComments) => void
}

interface CommentItemProps {
  comment: IComments
  handleLike: (id: string) => void
  handleUnlike: (id: string) => void
  onReply: (comment: IComments) => void
  isReply?: boolean
}

function CommentItem({
  comment,
  handleLike,
  handleUnlike,
  onReply,
  isReply = false,
}: CommentItemProps) {
  return (
    <Card className={`w-full space-y-4 ${isReply ? 'ml-8 mt-4' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {comment.author.image ? (
            <Image
              src={comment.author.image}
              alt="avatar"
              width={24}
              height={24}
              className="object-cover rounded-full"
              unoptimized
            />
          ) : (
            <div className="bg-muted-light rounded-full w-6 h-6 flex items-center justify-center">
              <User size={16} className="text-muted" />
            </div>
          )}
          <Link href={`/${comment.author.username}`} className="hover:underline">
            <span className="font-medium">{comment.author.username}</span>
          </Link>
        </div>
        <span className="text-sm text-gray-400">
          {formatRelativeTime(comment.comment.created_at)}
        </span>
      </div>

      <p className="text-gray-200">{comment.comment.text}</p>

      <div className="flex items-center justify-end space-x-4">
        {comment.requestingProfileSocialInfo && comment.socialCounts && (
          <LikeButton
            initialLikeCount={comment.socialCounts.likeCount}
            initiallyLiked={comment?.requestingProfileSocialInfo?.hasLiked}
            onLike={() => handleLike(comment.comment.id)}
            onUnlike={() => handleUnlike(comment.comment.id)}
          />
        )}
        <button
          onClick={() => onReply(comment)}
          className="flex items-center space-x-1 text-gray-400 hover:text-gray-300"
        >
          <MessageCircle size={16} />
          <span className="text-sm">
            {comment.socialCounts?.replyCount > 0
              ? `${comment.socialCounts.replyCount} ${
                  comment.socialCounts.replyCount === 1 ? 'Reply' : 'Replies'
                }`
              : 'Reply'}
          </span>
        </button>
      </div>

      {/* Display replies if they exist */}
      {comment.recentReplies?.map((reply) => (
        <CommentItem
          key={reply.comment.id}
          comment={reply}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          onReply={onReply}
          isReply
        />
      ))}
    </Card>
  )
}

export function CommentList({ comments, handleLike, handleUnlike, onReply }: CommentListProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.comment.id}
          comment={comment}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          onReply={onReply}
        />
      ))}
    </div>
  )
} 