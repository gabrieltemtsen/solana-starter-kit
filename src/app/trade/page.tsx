import { Swap } from '@/components/trade/components/swap'
import { Suspense } from 'react'

export default function TradePage() {
  return (
    <Suspense>
      <Swap />
    </Suspense>
  )
}
