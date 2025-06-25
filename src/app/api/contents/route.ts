import { NextRequest, NextResponse } from 'next/server'

// In-memory counter for auto-incrementing IDs (in production, this would be handled by the database)
let contentIdCounter = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestingProfileId = searchParams.get('requestingProfileId')
    
    let url = `${process.env.TAPESTRY_API_URL}/contents`
    const params = new URLSearchParams()
    
    if (requestingProfileId) {
      params.append('requestingProfileId', requestingProfileId)
    }
    
    // Add ordering by id ASC
    params.append('orderBy', 'id')
    params.append('order', 'ASC')
    
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
      throw new Error('Failed to fetch contents')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching contents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, text } = body
    
    if (!profileId || !text) {
      return NextResponse.json(
        { error: 'Profile ID and text are required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.TAPESTRY_API_URL}/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAPESTRY_API_KEY || '',
      },
      body: JSON.stringify({
        id: contentIdCounter++,
        profileId,
        text,
        title: '', // Leave blank as requested
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