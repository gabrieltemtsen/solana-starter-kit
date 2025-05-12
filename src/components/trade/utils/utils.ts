import { ITokenSearchResult } from "../models/jupiter/jup-api-models"

export const formatMarketCap = (
  marketCap: number | null,
  noMCapText: string
) => {
  if (!marketCap) return noMCapText

  // Handle very large numbers more gracefully
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}T`
  }
  if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}B`
  }
  if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}M`
  }
  if (marketCap >= 1e3) {
    return `$${(marketCap / 1e3).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}K`
  }
  return `$${marketCap.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`
}

export const formatPrice = (price: number | null) => {
  if (!price) return ''

  // For extremely small values (less than 0.000001)
  if (price < 0.000001) {
    // For values less than 0.00000001, use scientific notation
    if (price < 0.00000001) {
      return `$${price.toExponential(4)}`
    }
    // For small but not tiny values, show more decimal places
    return `$${price.toLocaleString(undefined, {
      maximumFractionDigits: 10,
      minimumFractionDigits: 8,
    })}`
  }

  // For small values (less than 0.01)
  if (price < 0.01) {
    return `$${price.toLocaleString(undefined, {
      maximumFractionDigits: 8,
      minimumFractionDigits: 6,
    })}`
  }

  // For normal values
  return `$${price.toLocaleString(undefined, {
    maximumFractionDigits: 6,
    minimumFractionDigits: 2,
  })}`
}

export const sortTokenResults = (
  results: ITokenSearchResult[],
  sortBy: string
) => {
  return [...results].sort((a, b) => {
    switch (sortBy) {
      case 'marketcap':
        if (a.verified !== b.verified) {
          return b.verified ? 1 : -1
        }
        return b.market_cap - a.market_cap
      case 'volume':
        if (a.verified !== b.verified) {
          return b.verified ? 1 : -1
        }
        return b.volume_24h_usd - a.volume_24h_usd
      case 'balance':
        // Convert balance to number for comparison
        const aBalance = a.uiAmount || 0
        const bBalance = b.uiAmount || 0
        return bBalance - aBalance
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
}