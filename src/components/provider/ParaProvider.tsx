"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ParaModal, AuthLayout, OAuthMethod } from "@getpara/react-sdk";
import { ParaSolanaWeb3Signer } from "@getpara/solana-web3.js-v1-integration";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Connection } from "@solana/web3.js";
import { para } from "@/config/constants";

const DEVNET_RPC_URL = "https://api.devnet.solana.com"; // Matches your useSolana

const queryClient = new QueryClient();

interface ParaContextType {
  isConnected: boolean;
  address: string | null;
  walletId: string | null;
  isLoading: boolean;
  error: string | null;
  openModal: () => void;
  closeModal: () => void;
  signer: ParaSolanaWeb3Signer | null;
  connection: Connection | null;
}

const ParaContext = createContext<ParaContextType | undefined>(undefined);


export function ParaProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signer, setSigner] = useState<ParaSolanaWeb3Signer | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);

  const initializeSolanaWeb3 = () => {
    const connection = new Connection(DEVNET_RPC_URL, "confirmed");
    const signer = new ParaSolanaWeb3Signer(para, connection);
    setConnection(connection);
    setSigner(signer);
  };

  const clearSolanaWeb3 = () => {
    setConnection(null);
    setSigner(null);
  };

  const checkAuthentication = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const isAuthenticated = await para.isFullyLoggedIn();
      setIsConnected(isAuthenticated);
      if (isAuthenticated) {
        const wallets = await para.getWalletsByType("SOLANA");
        if (wallets.length) {
          setAddress(wallets[0].address || null);
          setWalletId(wallets[0].id || null);
          initializeSolanaWeb3();
        } else {
          clearSolanaWeb3();
        }
      } else {
        clearSolanaWeb3();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
      clearSolanaWeb3();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
    return () => {
      clearSolanaWeb3();
    };
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(async () => {
    await checkAuthentication();
    setIsOpen(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ParaContext.Provider
        value={{
          isConnected,
          address,
          walletId,
          isLoading,
          error,
          openModal,
          closeModal,
          signer,
          connection,
        }}
      >
        {children}
        <ParaModal
          para={para}
          isOpen={isOpen}
          onClose={closeModal}
          disableEmailLogin={false}
          disablePhoneLogin={false}
          authLayout={[AuthLayout.AUTH_FULL]}
          oAuthMethods={[
            OAuthMethod.APPLE,
            OAuthMethod.DISCORD,
            OAuthMethod.FACEBOOK,
            OAuthMethod.FARCASTER,
            OAuthMethod.GOOGLE,
            OAuthMethod.TWITTER,
          ]}
          onRampTestMode={true}
          theme={{
            mode: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
            font: 'inherit',
            backgroundColor: '#FFFFFF',
            foregroundColor: '#09090b',
            accentColor: '#5252f2',
            darkBackgroundColor: '#09090b',
            darkForegroundColor: '#fafafa',
            darkAccentColor: '#9333ea',
          }}
          logo="/para.svg"
          recoverySecretStepEnabled={true}
          twoFactorAuthEnabled={false}
        />
      </ParaContext.Provider>
    </QueryClientProvider>
  );
}

export function usePara() {
  const context = useContext(ParaContext);
  if (context === undefined) {
    throw new Error("usePara must be used within a ParaProvider");
  }
  return context;
}