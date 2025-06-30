"use client";
import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { darkTheme, midnightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Toaster } from "@/components/ui/sonner";
const queryClient = new QueryClient();
import {wagmi_config} from "@/config"

/**
 * Wraps child components with Ethereum, React Query, and wallet UI providers.
 *
 * Supplies context for Ethereum state management, server state synchronization, wallet connection UI, and toast notifications to all descendant components.
 *
 * @param children - The React elements to receive the provided contexts
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmi_config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
