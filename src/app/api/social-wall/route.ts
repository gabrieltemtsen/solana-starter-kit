import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestingProfileId = searchParams.get('requestingProfileId')

    const response = await fetch(`${process.env.TAPESTRY_API_URL}/comments?targetProfileId=social-wall${requestingProfileId ? `&requestingProfileId=${requestingProfileId}` : ''}&includeReplies=true`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAPESTRY_API_KEY || '',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch comments')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, text, commentId } = body

    const response = await fetch(`${process.env.TAPESTRY_API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAPESTRY_API_KEY || '',
      },
      body: JSON.stringify({
        profileId,
        targetProfileId: 'social-wall',
        text,
        commentId, // For replies
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create comment')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create comment' },
      { status: 500 }
    )
  }
} 