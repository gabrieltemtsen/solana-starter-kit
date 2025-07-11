/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { usePara } from "@/components/provider/ParaProvider";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState, useEffect } from "react";

export function ParaTransactionDemo() {
  const [message, setMessage] = useState("");
  const [toAddress, setToAddress] = useState("devwuNsNYACyiEYxRNqMNseBpNnGfnd4ZwNHL7sphqv"); // Default to faucet
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [signature, setSignature] = useState<string>("");
  const [txSignature, setTxSignature] = useState<string>("");
  const [status, setStatus] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const { isConnected, address, signer, connection } = usePara();

  console.log("isConnected, address:", { isConnected, address });

  // Debug Para context
  useEffect(() => {
    console.log("Para Context:", { isConnected, address, signer, connection });
  }, [isConnected, address, signer, connection]);

  // Fetch balance when address changes
  const fetchBalance = async () => {
    if (!address || !connection || !signer || !signer.sender) {
      console.log("Balance fetch skipped:", { address, connection, signer });
      return;
    }

    setIsLoading(true);
    try {
      const balanceLamports = await connection.getBalance(signer.sender);
      setBalance((balanceLamports / LAMPORTS_PER_SOL).toFixed(4));
      console.log("Balance fetched:", balanceLamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setStatus({
        show: true,
        type: "error",
        message: "Failed to fetch balance. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) fetchBalance();
  }, [address]);

  // Sign message
  const handleSignMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ show: false, type: "success", message: "" });
    setSignature("");

    if (!signer) {
      setStatus({
        show: true,
        type: "error",
        message: "Signer not available. Please connect your wallet.",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!isConnected) {
        setStatus({
          show: true,
          type: "error",
          message: "Please connect your Para wallet to sign a message.",
        });
        return;
      }

      const messageToSign = message.trim();
      if (!messageToSign) {
        setStatus({
          show: true,
          type: "error",
          message: "Please enter a message to sign.",
        });
        return;
      }

      // Using signBytes if signMessage isn't available
      const messageBytes: any = new TextEncoder().encode(messageToSign);
      const signedBytes = await signer.signBytes(messageBytes);
      const signature = Buffer.from(signedBytes).toString("base64");
      
      setSignature(signature);
      setStatus({
        show: true,
        type: "success",
        message: "Message signed successfully!",
      });
    } catch (error) {
      console.error("Error signing message:", error);
      setStatus({
        show: true,
        type: "error",
        message: "Failed to sign message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send SOL transaction
  const handleSendTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ show: false, type: "success", message: "" });
    setTxSignature("");

    if (!signer || !connection || !signer.sender) {
      setStatus({
        show: true,
        type: "error",
        message: "Signer or connection not available. Please connect your wallet.",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!isConnected) {
        setStatus({
          show: true,
          type: "error",
          message: "Please connect your Para wallet to send a transaction.",
        });
        return;
      }

      // Validate recipient address
      let recipientPubkey;
      try {
        recipientPubkey = new PublicKey(toAddress);
      } catch (error) {
        setStatus({
          show: true,
          type: "error",
          message: "Invalid recipient address format.",
        });
        return;
      }

      const amountFloat = parseFloat(amount);
      if (isNaN(amountFloat)) {
        setStatus({
          show: true,
          type: "error",
          message: "Please enter a valid amount.",
        });
        return;
      }

      if (amountFloat <= 0) {
        setStatus({
          show: true,
          type: "error",
          message: "Amount must be greater than 0.",
        });
        return;
      }

      const amountLamports = BigInt(Math.round(amountFloat * LAMPORTS_PER_SOL));
      const balanceLamports = await connection.getBalance(signer.sender);

      if (amountLamports > BigInt(balanceLamports)) {
        const requiredSol = (Number(amountLamports) / LAMPORTS_PER_SOL).toFixed(4);
        const availableSol = (balanceLamports / LAMPORTS_PER_SOL).toFixed(4);
        setStatus({
          show: true,
          type: "error",
          message: `Insufficient balance. Requires ${requiredSol} SOL, but only ${availableSol} SOL available.`,
        });
        return;
      }

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const tx = new Transaction({
        feePayer: signer.sender,
        recentBlockhash: blockhash,
      });

      tx.add(
        SystemProgram.transfer({
          fromPubkey: signer.sender,
          toPubkey: recipientPubkey,
          lamports: amountLamports,
        })
      );

      console.log("Transaction created:", tx);

      // Sign and send the transaction
      const signedTx = await signer.signTransaction(tx);
      const txSignature = await connection.sendRawTransaction(signedTx.serialize());
      setTxSignature(txSignature);

      setStatus({
        show: true,
        type: "info",
        message: "Transaction submitted. Waiting for confirmation...",
      });

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        signature: txSignature,
        blockhash,
        lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      setStatus({
        show: true,
        type: "success",
        message: "Transaction confirmed!",
      });

      // Refresh balance
      await fetchBalance();
      setAmount("");
    } catch (error) {
      console.error("Error sending transaction:", error);
      setStatus({
        show: true,
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send transaction. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight mb-6 text-center text-blue-400">Para Transaction Demo</h1>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 text-center">
        Sign a message or send SOL using your Para wallet. This demo showcases message signing and SOL transfers on
        Devnet.
      </p>

      {/* Balance Section */}
      <div className="max-w-xl mx-auto mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-300">Current Balance:</h3>
          <button
            onClick={fetchBalance}
            disabled={isLoading || !address}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
            title="Refresh balance"
          >
            <span className={isLoading ? "animate-spin" : ""}>🔄</span>
          </button>
        </div>
        <p className="text-lg font-medium text-white">
          {!address
            ? "Connect wallet to see balance"
            : isLoading
            ? "Loading..."
            : balance
            ? `${parseFloat(balance).toFixed(4)} SOL`
            : "Unable to fetch balance"}
        </p>
        <p className="text-sm text-gray-400 mt-1">Network: Devnet</p>
      </div>

      {/* Status Message */}
      {status.show && (
        <div
          className={`max-w-xl mx-auto mb-6 p-4 rounded-lg border ${
            status.type === "success"
              ? "bg-green-900/50 border-green-700 text-green-200"
              : status.type === "error"
              ? "bg-red-900/50 border-red-700 text-red-200"
              : "bg-blue-900/50 border-blue-700 text-blue-200"
          }`}
        >
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      {/* Message Signing Form */}
      <div className="max-w-xl mx-auto mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Sign a Message</h2>
        <form onSubmit={handleSignMessage} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
              Message
            </label>
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to sign"
              required
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={!message || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md transition-colors disabled:opacity-50 text-white font-medium"
          >
            {isLoading ? "Signing..." : "Sign Message"}
          </button>
        </form>
        {signature && (
          <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded-md">
            <h3 className="text-sm font-medium mb-2 text-gray-300">Signature:</h3>
            <p className="text-sm break-all bg-gray-800 p-2 rounded-md text-gray-200">{signature}</p>
          </div>
        )}
      </div>

      {/* SOL Transfer Form */}
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Send SOL</h2>
        <form onSubmit={handleSendTransaction} className="space-y-4">
          <div>
            <label htmlFor="toAddress" className="block text-sm font-medium mb-2 text-gray-300">
              Recipient Address
            </label>
            <input
              id="toAddress"
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Enter recipient address"
              required
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2 text-gray-300">
              Amount (SOL)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              min="0"
              required
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={!toAddress || !amount || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md transition-colors disabled:opacity-50 text-white font-medium"
          >
            {isLoading ? "Sending..." : "Send Transaction"}
          </button>
        </form>
        {txSignature && (
          <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded-md">
            <h3 className="text-sm font-medium mb-2 text-gray-300">Transaction Signature:</h3>
            <a
              href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              <p className="text-sm break-all bg-gray-800 p-2 rounded-md text-gray-200">{txSignature}</p>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}