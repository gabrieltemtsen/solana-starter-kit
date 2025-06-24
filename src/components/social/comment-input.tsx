'use client'

import { Button } from '@/components/common/button'
import { LoadCircle } from '@/components/common/load-circle'

interface CommentInputProps {
  commentText: string
  setCommentText: (text: string) => void
  handleSubmit: () => void
  loading: boolean
}

export function CommentInput({
  commentText,
  setCommentText,
  handleSubmit,
  loading,
}: CommentInputProps) {
  return (
    <div className="flex flex-col space-y-4">
      <textarea
        className="w-full p-3 border border-muted-light rounded-md bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-accent min-h-[100px]"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Share your thoughts..."
      />
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={loading || !commentText.trim()}
        >
          {loading ? <LoadCircle /> : 'Post Comment'}
        </Button>
      </div>
    </div>
  )
} 