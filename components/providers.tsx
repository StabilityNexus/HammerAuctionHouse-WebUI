"use client";
import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { darkTheme, midnightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Toaster } from "@/components/ui/sonner";
const queryClient = new QueryClient();
import {wagmi_config} from "@/config"

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
