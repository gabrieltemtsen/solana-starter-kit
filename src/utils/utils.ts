import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const randomIntInRange = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const formatRelativeTime = (timestamp: number): string => {
  const now = new Date().getTime()
  const diff = now - (timestamp > 9999999999 ? timestamp : timestamp * 1000) // Adjust for milliseconds if needed

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `published ${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `published ${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `published ${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return `published ${seconds} second${seconds > 1 ? 's' : ''} ago`
  }
}
