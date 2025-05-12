'use client'

import { Button, ButtonSize } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface Props {
  loading: boolean
  handleSwap: () => void
}

export function CenterButtonSwap({ loading, handleSwap }: Props) {
  return (
    <div className="w-full">
      <Button
        onClick={handleSwap}
        size={ButtonSize.LG}
        disabled={loading}
        className="w-full"
      >
        {loading ? <Spinner /> : 'Execute Swap'}
      </Button>
    </div>
  )
}
