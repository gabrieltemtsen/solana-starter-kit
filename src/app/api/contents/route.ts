import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, text, title } = body

    const response = await fetch(`${process.env.TAPESTRY_API_URL}/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAPESTRY_API_KEY || '',
      },
      body: JSON.stringify({
        profileId,
        text,
        title,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create content')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create content' },
      { status: 500 }
    )
  }
} 