'use client'

import { useState } from 'react'
import { Button } from '@/components/common/button'
import { LoadCircle } from '@/components/common/load-circle'
import { useCreateContent } from './hooks/use-create-content'

interface PostInputProps {
  profileId: number | null
  onPostCreated: () => void
}

export function PostInput({ profileId, onPostCreated }: PostInputProps) {
  const [postText, setPostText] = useState('')
  const { createContent, loading } = useCreateContent()

  const handleSubmit = async () => {
    if (!profileId || !postText.trim()) return

    try {
      await createContent(profileId, postText.trim())
      setPostText('')
      onPostCreated()
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!profileId) {
    return (
      <div className="w-full p-4 border border-muted-light rounded-lg bg-muted-light/10">
        <p className="text-center text-muted">Please log in to create posts</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <textarea
        className="w-full p-4 border border-muted-light rounded-lg bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-accent min-h-[120px]"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What's on your mind?"
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={loading || !postText.trim()}
          className="flex items-center space-x-2"
        >
          {loading ? <LoadCircle /> : 'Post'}
        </Button>
      </div>
    </div>
  )
} 