export function useToastContent() {
  const ERRORS = {
    WALLET_CONNETION_ERR: {
      title: 'WALLET ERROR',
      content: {
        description: 'Please connect the solana wallet',
        duration: 5000,
      },
    },
    JUP_QUOTE_API_ERR: {
      title: 'Jupiter Quote API Error',
      content: {
        description:
          'Failed to fetch Jupiter Quote API. Please try again later',
        duration: 5000,
      },
    },
    JUP_SWAP_API_ERR: {
      title: 'Jupiter SWAP API Error',
      content: {
        description: 'Failed to fetch Jupiter SWAP API. Please try again later',
        duration: 5000,
      },
    },
    TX_FAILED_ERR: {
      title: 'Transaction Failed',
      content: {
        description: 'Swap transaction failed. please try again',
        duration: 5000,
      },
    },
  }

  const LOADINGS = {
    PREPARING_LOADING: {
      title: 'preparing swap',
      content: {
        description: 'preparing your swap transaction',
        duration: 2000,
      },
    },
    SEND_LOADING: {
      title: 'sending transaction',
      content: {
        description: 'Please approve the transaction in your wallet',
        duration: 2000,
      },
    },
    CONFIRM_LOADING: {
      title: 'confirming_transaction',
      content: {
        description: 'Waiting for confirmation',
        duration: 1000000000,
      },
    },
  }

  const SUCCESS = {
    TX_SUCCESS: {
      title: 'Transaction success',
      content: {
        description: 'Swap transaction Success',
        duration: 2000,
      },
    },
  }

  return {
    ERRORS,
    LOADINGS,
    SUCCESS,
  }
}
