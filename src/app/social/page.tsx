'use client'

import { Card } from '@/components/common/card'
import { CommentWall } from '@/components/social/comment-wall'

export default function SocialPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Social Wall</h1>
        <p className="text-gray-400">Join the conversation! Share your thoughts and interact with others.</p>
      </Card>
      
      <CommentWall />
    </div>
  )
} 