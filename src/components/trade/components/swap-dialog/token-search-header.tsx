'use client'

import { Search } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { SortOptionsDetails } from '../../constants'
import { Checkbox } from '@/components/ui/switch/checkbox'
import { Input } from '@/components/ui/form'
import { FilterTabs } from '@/components/ui/tabs/filter-tabs'

interface TokenSearchHeaderProps {
  searchQuery: string
  verifiedOnly: boolean
  sortOptions: { label: string; value: SortOptionsDetails }[]
  sortBy: SortOptionsDetails
  setSearchQuery: (query: string) => void
  setVerifiedOnly: (verified: boolean) => void
  setSortBy: (option: SortOptionsDetails) => void
}

export function TokenSearchHeader({
  searchQuery,
  verifiedOnly,
  sortOptions,
  sortBy,
  setSearchQuery,
  setVerifiedOnly,
  setSortBy,
}: TokenSearchHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="p-4 space-y-6">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={'search tokens'}
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2"
          size={16}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="verified_only"
          checked={verifiedOnly}
          onCheckedChange={(val) => setVerifiedOnly(!!val)}
        />
        <label htmlFor="verified_only" className="text-sm cursor-pointer">
          {'verified tokens only'}
        </label>
      </div>

      <FilterTabs
        options={sortOptions}
        selected={sortBy}
        onSelect={setSortBy}
      />
    </div>
  )
}
