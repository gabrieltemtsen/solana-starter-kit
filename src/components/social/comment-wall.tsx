'use client'

import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { Alert } from '@/components/common/alert'
import { Card } from '@/components/common/card'
import { LoadCircle } from '@/components/common/load-circle'
import { useCreateComment } from '@/components/profile/hooks/use-create-comment'
import { useCreateLike, useCreateUnlike } from '@/components/profile/hooks/use-create-like'
import { useGetComments } from '@/components/profile/hooks/use-get-comments'
import { IComments } from '@/models/comment.models'
import { useEffect, useState } from 'react'
import { CommentInput } from './comment-input'
import { CommentList } from './comment-list'

interface Alert {
  type: 'success' | 'error'
  message: string
}

export function CommentWall() {
  const { mainUsername } = useCurrentWallet()
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<IComments | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])

  const { data, loading, error, refetch } = useGetComments({
    targetProfileId: 'social-wall',
    requestingProfileId: mainUsername,
  })

  const {
    createComment,
    loading: commentLoading,
    error: commentError,
    success: commentSuccess,
  } = useCreateComment()

  const { createLike, error: likeError, success: likeSuccess } = useCreateLike()
  const { createUnlike, error: unlikeError, success: unlikeSuccess } = useCreateUnlike()

  useEffect(() => {
    if (commentSuccess || likeSuccess || unlikeSuccess) {
      refetch()
    }
    if (commentSuccess) {
      setCommentText('')
      setReplyingTo(null)
      showAlert('success', 'Comment posted successfully!')
    }
  }, [commentSuccess, likeSuccess, unlikeSuccess, refetch])

  useEffect(() => {
    if (commentError) showAlert('error', `Error posting comment: ${commentError}`)
    if (likeError) showAlert('error', `Error liking comment: ${likeError}`)
    if (unlikeError) showAlert('error', `Error unliking comment: ${unlikeError}`)
  }, [commentError, likeError, unlikeError])

  const showAlert = (type: 'success' | 'error', message: string) => {
    const newAlert = { type, message }
    setAlerts((prev) => [...prev, newAlert])
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert !== newAlert))
    }, 5000)
  }

  const handleSubmitComment = async () => {
    if (!mainUsername || !commentText.trim()) return

    try {
      await createComment({
        profileId: mainUsername,
        targetProfileId: 'social-wall',
        text: commentText,
        commentId: replyingTo?.comment.id,
      })
    } catch (err) {
      console.error('Failed to post comment:', err)
      showAlert('error', 'Failed to post comment. Please try again.')
    }
  }

  const handleReply = (comment: IComments) => {
    setReplyingTo(comment)
    setCommentText(`@${comment.author.username} `)
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setCommentText('')
  }

  const handleLike = (id: string) => {
    if (!mainUsername) return
    createLike({ nodeId: id, startId: mainUsername })
  }

  const handleUnlike = (id: string) => {
    if (!mainUsername) return
    createUnlike({ nodeId: id, startId: mainUsername })
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <Alert type="error" message={`Error loading comments: ${error}`} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        {replyingTo && (
          <div className="mb-4 p-2 bg-muted-light rounded-md">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                Replying to <span className="font-medium">@{replyingTo.author.username}</span>
              </p>
              <button
                onClick={cancelReply}
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          handleSubmit={handleSubmitComment}
          loading={commentLoading}
        />
      </Card>

      {loading ? (
        <div className="flex justify-center">
          <LoadCircle />
        </div>
      ) : data?.comments.length === 0 ? (
        <Card>
          <p className="text-center text-gray-400">No comments yet. Be the first to start the conversation!</p>
        </Card>
      ) : (
        <CommentList
          comments={data?.comments || []}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          onReply={handleReply}
        />
      )}

      <div className="fixed bottom-4 right-4 space-y-2">
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            type={alert.type}
            message={alert.message}
            duration={5000}
          />
        ))}
      </div>
    </div>
  )
} 