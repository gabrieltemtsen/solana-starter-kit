'use client'

import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { useGetProfiles } from '@/components/auth/hooks/use-get-profiles'
import { Card } from '@/components/common/card'
import { LoadCircle } from '@/components/common/load-circle'
import { PostInput } from '@/components/social/post-input'
import { PostItem } from '@/components/social/post-item'
import { useGetContents } from '@/components/social/hooks/use-get-contents'

export default function SocialPage() {
  const { walletAddress } = useCurrentWallet()
  const { profiles } = useGetProfiles({ walletAddress })
  const profileIdString = profiles?.[0]?.profile?.id
  const profileId = profileIdString ? parseInt(profileIdString) : null
  const { contents, loading, refetch } = useGetContents(profileId)

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Social Feed</h1>
        <p className="text-gray-400">Share your thoughts and join the conversation!</p>
      </Card>
      
      {/* Post Input */}
      <Card>
        <PostInput profileId={profileId} onPostCreated={refetch} />
      </Card>
      
      {/* Posts Feed */}
      {loading ? (
        <Card>
          <div className="flex justify-center py-8">
            <LoadCircle />
          </div>
        </Card>
      ) : contents.length === 0 ? (
        <Card>
          <p className="text-center text-muted py-8">
            No posts yet. Be the first to share something!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {contents.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              currentProfileId={profileId}
              onUpdate={refetch}
            />
          ))}
        </div>
      )}
    </div>
  )
} 