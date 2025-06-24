'use client'

import { Button } from '@/components/common/button'
import { LoadCircle } from '@/components/common/load-circle'
import { LogIn } from 'lucide-react'

interface CommentInputProps {
  commentText: string
  setCommentText: (text: string) => void
  handleSubmit: () => void
  loading: boolean
  isAuthed: boolean
}

export function CommentInput({
  commentText,
  setCommentText,
  handleSubmit,
  loading,
  isAuthed,
}: CommentInputProps) {
  return (
    <div className="flex flex-col space-y-4">
      <textarea
        className="w-full p-3 border border-muted-light rounded-md bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-accent min-h-[100px]"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder={isAuthed ? "Share your thoughts..." : "Log in to join the conversation..."}
        disabled={!isAuthed}
      />
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={isAuthed ? (loading || !commentText.trim()) : false}
          className="flex items-center space-x-2"
        >
          {loading ? (
            <LoadCircle />
          ) : !isAuthed ? (
            <>
              <LogIn size={16} />
              <span>Log in to comment</span>
            </>
          ) : (
            'Post Comment'
          )}
        </Button>
      </div>
    </div>
  )
} 