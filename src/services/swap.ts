import { JUPITER_CONFIG } from '@/config/jupiter'
import {
  buildTransactionMessage,
  fetchSwapInstructions,
  getAddressLookupTableAccounts,
  simulateTransaction,
} from '@/services/jupiter'
import type { SwapRouteResponse } from '@/types/jupiter-service'
import { createATAIfNotExists } from '@/utils/token'
import {
  Connection,
  Keypair,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js'
import bs58 from 'bs58'

export interface SwapRequest {
  quoteResponse: any
  walletAddress: string
  sseTokenAccount?: string
  sseFeeAmount?: string
  priorityFee?: number
  mintAddress: string
  isCopyTrade?: boolean
  slippageMode: 'auto' | 'fixed'
  slippageBps: number
}

export class SwapService {
  private connection: Connection

  constructor(connection: Connection) {
    this.connection = connection
  }

  private async getPayerKeypair(): Promise<Keypair> {
    const PRIVATE_KEY = process.env.PAYER_PRIVATE_KEY
    if (!PRIVATE_KEY) {
      throw new Error('PAYER_PRIVATE_KEY is not set')
    }
    const secretKey = bs58.decode(PRIVATE_KEY)
    return Keypair.fromSecretKey(secretKey)
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public async verifyOrCreateATA(
    mintAddress: string,
    ownerAddress: string,
    retryCount = 0,
  ): Promise<PublicKey> {
    try {
      // Get the payer ready in case we need it
      const payer = await this.getPayerKeypair()

      // Call createATAIfNotExists directly - it will handle the existence check
      const { ata: associatedTokenAddress } =
        await createATAIfNotExists(
          this.connection,
          payer,
          new PublicKey(mintAddress),
          new PublicKey(ownerAddress),
          'High',
        )

      return associatedTokenAddress
    } catch (error: any) {
      const maxRetries = 3
      if (retryCount < maxRetries) {
        const delayMs = 500 * Math.pow(2, retryCount) // Exponential backoff: 500ms, 1000ms, 2000ms
        console.log(
          `Retrying verifyOrCreateATA attempt ${
            retryCount + 1
          }/${maxRetries} after ${delayMs}ms delay`,
        )
        await this.delay(delayMs)
        return this.verifyOrCreateATA(mintAddress, ownerAddress, retryCount + 1)
      }

      console.error('Error in checking ATA status')
      throw error
    }
  }

  // create connection
  public static async createConnection(): Promise<Connection> {
    return new Connection(
      process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
    )
  }

  public async buildSwapTransaction(
    request: SwapRequest,
    outputAta: PublicKey,
  ): Promise<{
    transaction: VersionedTransaction
    swapResponse: any
    addressLookupTableAccounts: any[]
  }> {
    try {
      const effectiveSlippageBps =
        request.slippageMode === 'auto'
          ? request.quoteResponse.slippageBps
          : request.slippageBps

      let swapResponse
      try {
        swapResponse = await fetchSwapInstructions({
          quoteResponse: request.quoteResponse,
          userPublicKey: request.walletAddress,
          prioritizationFeeLamports: request.priorityFee,
          feeAccount: outputAta.toString(),
          slippageBps: effectiveSlippageBps,
        })
      } catch (error: any) {
        console.error('Error in fetch Swap Instruction', error)
        throw error
      }

      let addressLookupTableAccounts
      try {
        addressLookupTableAccounts = await getAddressLookupTableAccounts(
          this.connection,
          swapResponse.addressLookupTableAddresses || [],
        )
      } catch (error: any) {
        console.log('Error in get address lookup table accounts', error)
        throw error
      }

      const { blockhash } = await this.connection.getLatestBlockhash()

      const message = buildTransactionMessage(
        new PublicKey(request.walletAddress),
        blockhash,
        swapResponse,
        undefined,
        addressLookupTableAccounts,
      )

      return {
        transaction: new VersionedTransaction(message),
        swapResponse,
        addressLookupTableAccounts,
      }
    } catch (error: any) {
      console.error('Error in build swap transaction:', error)
      throw error
    }
  }

  public async createSwapTransaction(
    request: SwapRequest,
  ): Promise<SwapRouteResponse> {
    try {
      // Verify output token ATA
      const outputAta = await this.verifyOrCreateATA(
        request.mintAddress,
        JUPITER_CONFIG.FEE_WALLET,
        3,
      )

      // Build and simulate transaction
      const { transaction, swapResponse, addressLookupTableAccounts } =
        await this.buildSwapTransaction(request, outputAta)

      try {
        await simulateTransaction(
          this.connection,
          transaction,
          addressLookupTableAccounts,
        )
      } catch (error: any) {
        console.error('Error in simulate transaction:', error)
      }

      const response = {
        transaction: Buffer.from(transaction.serialize()).toString('base64'),
        lastValidBlockHeight: swapResponse.lastValidBlockHeight,
        computeUnitLimit: swapResponse.computeUnitLimit,
        prioritizationFeeLamports: swapResponse.prioritizationFeeLamports,
      }

      return response
    } catch (error: any) {
      console.error('Error in create swap transaction:', error)
      throw error
    }
  }
}
