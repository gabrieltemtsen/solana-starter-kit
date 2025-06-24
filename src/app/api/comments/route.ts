import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetProfileId = searchParams.get('targetProfileId')
    const contentId = searchParams.get('contentId')
    const requestingProfileId = searchParams.get('requestingProfileId')

    let url = `${process.env.TAPESTRY_API_URL}/comments`
    const params = new URLSearchParams()

    if (targetProfileId) {
      params.append('targetProfileId', targetProfileId)
    }
    if (contentId) {
      params.append('contentId', contentId)
    }
    if (requestingProfileId) {
      params.append('requestingProfileId', requestingProfileId)
    }
    params.append('includeReplies', 'true')

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    const response = await fetch(url, {
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
    const { profileId, targetProfileId, contentId, text, commentId } = body

    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      )
    }

    if (!text) {
      return NextResponse.json(
        { error: 'Comment text is required' },
        { status: 400 }
      )
    }

    const payload: any = {
      profileId,
      text,
    }

    if (targetProfileId) {
      payload.targetProfileId = targetProfileId
    }

    if (contentId) {
      payload.contentId = contentId
    }

    if (commentId) {
      payload.commentId = commentId
    }

    const response = await fetch(`${process.env.TAPESTRY_API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAPESTRY_API_KEY || '',
      },
      body: JSON.stringify(payload),
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
