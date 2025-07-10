"use client";

import { ParaProvider as ParaSDKProvider, ParaModal } from "@getpara/react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { API_KEY, ENVIRONMENT } from "@/config/constants";

const queryClient = new QueryClient();


export function ParaProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
    <ParaSDKProvider
      paraClientConfig={{
        apiKey: API_KEY,
        env: ENVIRONMENT,
      }}
      >
      {children}
       <ParaModal />
    </ParaSDKProvider>
    </QueryClientProvider>
  );
}