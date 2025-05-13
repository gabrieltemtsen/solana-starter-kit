import { USDC_MINT } from '@/components/trade/constants'
import { useEffect, useState } from 'react'

interface Props {
  tokenMint?: string | null
  decimals?: number
}

export function useTokenUSDCPrice({ tokenMint, decimals = 6 }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [tokenUsdcPrice, setTokenUsdcPrice] = useState<number>(0)

  useEffect(() => {
    const fetchTokenUsdcPrice = async () => {
      try {
        setLoading(true)
        if (tokenMint === USDC_MINT) {
          setTokenUsdcPrice(1)
        } else {
          const amount = Math.pow(10, decimals)
          const QUOTE_URL = `https://quote-api.jup.ag/v6/quote?inputMint=${tokenMint}&outputMint=${USDC_MINT}&amount=${amount}&slippageBps=${50}`
          const response = await fetch(QUOTE_URL).then((res) => res.json())
          console.log('response:', response)
          setTokenUsdcPrice(response.outAmount / Math.pow(10, decimals))
        }
      } catch (error) {
        console.log('error', error)
        setError('Error in Fetch USDC Quote')
      } finally {
        setLoading(false)
      }
    }

    fetchTokenUsdcPrice()
  }, [tokenMint, decimals])

  return {
    price: tokenUsdcPrice,
    loading: loading,
    error,
  }
}
