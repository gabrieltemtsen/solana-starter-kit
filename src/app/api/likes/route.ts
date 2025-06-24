import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nodeId, startId } = body

    const response = await fetch(`${process.env.TAPESTRY_API_URL}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAPESTRY_API_KEY || '',
      },
      body: JSON.stringify({ nodeId, startId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create like')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create like' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { nodeId, startId } = body

    const response = await fetch(`${process.env.TAPESTRY_API_URL}/likes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAPESTRY_API_KEY || '',
      },
      body: JSON.stringify({ nodeId, startId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to remove like')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error removing like:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove like' },
      { status: 500 }
    )
  }
}
