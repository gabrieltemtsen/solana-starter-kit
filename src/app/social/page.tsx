'use client'

import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { Alert } from '@/components/common/alert'
import { Card } from '@/components/common/card'
import { CommentWall } from '@/components/social/comment-wall'

export default function SocialPage() {
  const { mainUsername } = useCurrentWallet()

  if (!mainUsername) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Alert type="error" message="Please connect your wallet and create a profile to participate in the social wall." />
      </div>
    )
  }

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