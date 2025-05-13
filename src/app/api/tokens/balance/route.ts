import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get('walletAddress')
  const mintAddress = searchParams.get('mintAddress')

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'walletAddress is required' },
      { status: 400 },
    )
  }

  try {
    // If mintAddress is provided, fetch balance for specific token
    // Otherwise fetch all token balances for the wallet
    const endpoint =
      process.env.HELIUS_RPC_URL ||
      'https://mainnet.helius-rpc.com/?api-key=' + process.env.HELIUS_API_KEY

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssets',
        params: {
          ownerAddress: walletAddress,
          tokenType: mintAddress ? undefined : 'all',
          mintAccounts: mintAddress ? [mintAddress] : undefined,
          displayOptions: {
            showFungible: true,
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`)
    }

    return NextResponse.json({
      tokens: data.result,
    })
  } catch (error) {
    console.error('Error fetching token balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token balance' },
      { status: 500 },
    )
  }
}
