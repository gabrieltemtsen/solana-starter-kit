// This file manages the website content ID for the social wall
// In production, you might want to store this in a database or environment variable

let websiteContentId: string | null = null

export async function getOrCreateWebsiteContent(profileId: string): Promise<string> {
  // If we already have the content ID, return it
  if (websiteContentId) {
    return websiteContentId
  }

  try {
    // Try to create the website content
    const response = await fetch('/api/contents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId,
        text: 'Social Wall - A place for community discussions',
        title: 'Social Wall',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create website content')
    }

    const data = await response.json()
    const contentId = data.content.id
    websiteContentId = contentId
    
    // Store in localStorage for persistence across sessions
    if (typeof window !== 'undefined') {
      localStorage.setItem('socialWallContentId', contentId)
    }
    
    return contentId
  } catch (error) {
    console.error('Error creating website content:', error)
    throw error
  }
}

export function getWebsiteContentId(): string | null {
  // First check memory
  if (websiteContentId) {
    return websiteContentId
  }
  
  // Then check localStorage
  if (typeof window !== 'undefined') {
    const storedId = localStorage.getItem('socialWallContentId')
    if (storedId) {
      websiteContentId = storedId
      return storedId
    }
  }
  
  return null
}

export function setWebsiteContentId(id: string) {
  websiteContentId = id
  if (typeof window !== 'undefined') {
    localStorage.setItem('socialWallContentId', id)
  }
} 