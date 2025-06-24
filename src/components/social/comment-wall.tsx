'use client'

import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { Alert } from '@/components/common/alert'
import { Card } from '@/components/common/card'
import { LoadCircle } from '@/components/common/load-circle'
import { useCreateComment } from '@/components/profile/hooks/use-create-comment'
import { useCreateLike, useCreateUnlike } from '@/components/profile/hooks/use-create-like'
import { useGetComments } from '@/components/profile/hooks/use-get-comments'
import { IComments } from '@/models/comment.models'
import { getOrCreateWebsiteContent, getWebsiteContentId } from '@/utils/social-wall-content'
import { useLogin } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { CommentInput } from './comment-input'
import { CommentList } from './comment-list'

interface Alert {
  type: 'success' | 'error'
  message: string
}

export function CommentWall() {
  const { mainUsername } = useCurrentWallet()
  const { login } = useLogin()
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<IComments | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [contentId, setContentId] = useState<string | null>(null)
  const [contentLoading, setContentLoading] = useState(true)

  // Initialize or get the website content ID
  useEffect(() => {
    const initializeContent = async () => {
      try {
        // First check if we already have a content ID
        let id = getWebsiteContentId()
        
        // If not and user is authenticated, create one
        if (!id && mainUsername) {
          id = await getOrCreateWebsiteContent(mainUsername)
        }
        
        setContentId(id)
      } catch (error) {
        console.error('Failed to initialize content:', error)
        showAlert('error', 'Failed to initialize social wall. Please refresh the page.')
      } finally {
        setContentLoading(false)
      }
    }

    initializeContent()
  }, [mainUsername])

  const { data, loading, error, refetch } = useGetComments({
    contentId: contentId || undefined,
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
    if (!mainUsername || !commentText.trim() || !contentId) return

    try {
      await createComment({
        profileId: mainUsername,
        contentId: contentId,
        text: commentText,
        commentId: replyingTo?.comment.id, // Only include commentId for replies
      })
    } catch (err) {
      console.error('Failed to post comment:', err)
      showAlert('error', 'Failed to post comment. Please try again.')
    }
  }

  const handleReply = (comment: IComments) => {
    if (!mainUsername) {
      handleLogin()
      return
    }
    setReplyingTo(comment)
    setCommentText(`@${comment.author.username} `)
  }

  const handleLogin = () => {
    login({
      loginMethods: ['wallet'],
      walletChainType: 'ethereum-and-solana',
      disableSignup: false,
    })
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setCommentText('')
  }

  const handleLike = (id: string) => {
    if (!mainUsername) {
      handleLogin()
      return
    }
    createLike({ nodeId: id, startId: mainUsername })
  }

  const handleUnlike = (id: string) => {
    if (!mainUsername) {
      handleLogin()
      return
    }
    createUnlike({ nodeId: id, startId: mainUsername })
  }

  if (contentLoading) {
    return (
      <div className="flex justify-center">
        <LoadCircle />
      </div>
    )
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
          handleSubmit={mainUsername && contentId ? handleSubmitComment : handleLogin}
          loading={commentLoading}
          isAuthed={!!mainUsername}
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
          isAuthed={!!mainUsername}
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