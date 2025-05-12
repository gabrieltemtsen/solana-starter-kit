import { useEffect, useState } from 'react'
import {
  IGetProfilePortfolioFailedResponse,
  IGetProfilePortfolioResponse,
  ITokenPortfolioItem,
} from '../../models/birdeye/birdeye-api-models'

interface Props {
  walletAddress: string
}

export function useGetProfilePortfolio({ walletAddress }: Props) {
  const [data, setData] = useState<ITokenPortfolioItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    try {
      setLoading(true)
      const fetchWalletPortfolio = async () => {
        const url = `https://public-api.birdeye.so/v1/wallet/token_list/?wallet=${walletAddress}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-chain': 'solana',
            'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '',
          },
        })

        const jsonRes:
          | IGetProfilePortfolioResponse
          | IGetProfilePortfolioFailedResponse = await response.json()
        if (jsonRes.success) {
          setData((jsonRes as IGetProfilePortfolioResponse).data.items)
        } else {
          setError((jsonRes as IGetProfilePortfolioFailedResponse).message)
        }
      }

      fetchWalletPortfolio()
    } catch (error) {
      setError("Error in fetching wallet portfolio")
      console.error('Error in fetching wallet portfolio', error)
    } finally {
      setLoading(false)
    }
  }, [walletAddress])
  return {
    data,
    loading,
    error,
  }
}
