"use client";

import { ParaProvider as ParaSDKProvider } from "@getpara/react-sdk";
import { API_KEY, ENVIRONMENT } from "@/config/constants";

export function ParaProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ParaSDKProvider
      paraClientConfig={{
        apiKey: API_KEY,
        env: ENVIRONMENT,
      }}
        config={{
            disableAutoSessionKeepAlive: true,
            paraClientOverride: undefined, // Use default Para client
        }}
      // paraModalConfig removed because it's not a valid prop for ParaSDKProvider
    >
      {children}
    </ParaSDKProvider>
  );
}