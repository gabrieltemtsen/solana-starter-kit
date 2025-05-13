'use client'

import Image from 'next/image'
import { ITokenSearchResult } from '../../models/jupiter/jup-api-models'
import { Button, ButtonVariant } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { formatMarketCap, formatPrice } from '../../utils/utils'

interface TokenListItemProps {
  token: ITokenSearchResult
  onSelect: (token: ITokenSearchResult) => void
}

export function TokenListItem({ token, onSelect }: TokenListItemProps) {

  // Format balance to a readable format
  const formattedBalance = token.uiAmount
    ? token.uiAmount.toLocaleString(undefined, {
        maximumFractionDigits: token.uiAmount > 1000 ? 2 : 4,
      })
    : null

  // Format value to a readable format
  const formattedValue = token.valueUsd
    ? `$${token.valueUsd.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`
    : null

  return (
    <Button
      variant={ButtonVariant.GHOST}
      className="w-full p-3 flex items-center gap-3 text-left h-18"
      onClick={() => onSelect(token)}
    >
      <div className="relative w-8 h-8 shrink-0">
        {token.logoURI ? (
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={token.logoURI}
              alt={token.symbol}
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {(token.symbol || '??').slice(0, 2)}
            </span>
          </div>
        )}
        {token.verified && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
            <Check className="text-background" size={12} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{token.symbol}</span>
          <span className="text-sm truncate">{token.name}</span>
          {token.chainId && (
            <span className="text-xs px-1.5 py-0.5 rounded-full">
              {token.chainId}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-sm font-medium flex items-center gap-2">
            <span>{formatPrice(token.price || token.priceUsd || 0)}</span>
            {formattedBalance && (
              <span className="text-xs text-primary">
                {formattedBalance} {token.symbol}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {formattedValue ? (
              <span>{formattedValue}</span>
            ) : (
              <span className="font-medium">
                {'market_cap'}:{' '}
                {formatMarketCap(token.market_cap, 'no marketcap')}
              </span>
            )}
            {token.volume_24h_usd > 0 && (
              <>
                <span>•</span>
                <span>
                  {'volume'}: $
                  {(token.volume_24h_usd / 1e6).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                  {'.m'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Button>
  )
}
