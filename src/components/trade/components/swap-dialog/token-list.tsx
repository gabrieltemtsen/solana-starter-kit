'use client'

import { Spinner } from "@/components/ui/spinner"
import { ITokenSearchResult } from "../../models/jupiter/jup-api-models"
import { sortTokenResults } from "../../utils/utils"
import { TokenListItem } from "./token-list-item"

interface TokenListProps {
  isLoading: boolean
  error: string | null
  searchQuery: string
  searchResults: ITokenSearchResult[]
  verifiedOnly: boolean
  sortBy: string
  onSelect: (token: ITokenSearchResult) => void
}

export function TokenList({
  isLoading,
  error,
  searchQuery,
  searchResults,
  verifiedOnly,
  sortBy,
  onSelect,
}: TokenListProps) {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-destructive text-center">{error}</div>
  }

  if (searchResults.length === 0) {
    return (
      <div className="p-4 text-center">
        {searchQuery
          ? 'no tokens found'
          : 'start typing to search for tokens'}
      </div>
    )
  }

  const filteredResults = sortTokenResults(searchResults, sortBy).filter(
    (token) => !verifiedOnly || token.verified
  )

  if (filteredResults.length === 0) {
    return <div className="p-4 text-center">no verified tokens found</div>
  }

  return (
    <div>
      {filteredResults.map((token) => (
        <TokenListItem key={token.address} token={token} onSelect={onSelect} />
      ))}
    </div>
  )
}
