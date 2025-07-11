"use client";

import { useEffect, useState } from "react";
import { ParaSolanaWeb3Signer } from "@getpara/solana-web3.js-v1-integration";
import { useSolana } from "./useSolana";
import { usePara } from "@/components/provider/ParaProvider";
import { para } from "@/config/constants";

export function useParaSigner() {
  const { signer: contextSigner, connection, isConnected } = usePara();
  const { connection: solanaConnection } = useSolana();
  const [signer, setSigner] = useState<ParaSolanaWeb3Signer | null>(null);

  useEffect(() => {
    if (isConnected && connection && solanaConnection) {
      try {
        // Use the signer from ParaProvider if available, otherwise initialize a new one
        const newSigner = contextSigner || new ParaSolanaWeb3Signer(para, solanaConnection); // Replace 'para' with actual client
        setSigner(newSigner);
      } catch (error) {
        console.error("Failed to initialize Para signer:", error);
        setSigner(null);
      }
    } else {
      setSigner(null);
    }
  }, [isConnected, connection, solanaConnection, contextSigner]);

  return {
    signer,
    connection: solanaConnection || connection, // Prefer useSolana connection if available
  };
}