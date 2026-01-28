"use client";

import { useState, useCallback, useEffect } from "react";
import { safeLocalStorage } from "@/lib/browser-utils";

// This is a mock implementation of a wallet hook
// In a real application, this would use RainbowKit and Wagmi
export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  // Generate random wallet address when connecting
  const generateRandomAddress = useCallback(() => {
    return "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
  }, []);

  const connect = useCallback(() => {
    const addr = generateRandomAddress();
    setAddress(addr);
    setIsConnected(true);
    safeLocalStorage.setItem("wallet_connected", "true");
    safeLocalStorage.setItem("wallet_address", addr);
  }, [generateRandomAddress]);

  const disconnect = useCallback(() => {
    setAddress("");
    setIsConnected(false);
    safeLocalStorage.removeItem("wallet_connected");
    safeLocalStorage.removeItem("wallet_address");
  }, []);

  // Load wallet state from localStorage
  useEffect(() => {
    const isWalletConnected = safeLocalStorage.getItem("wallet_connected") === "true";
    const savedAddress = safeLocalStorage.getItem("wallet_address");
    
    if (isWalletConnected && savedAddress) {
      setIsConnected(true);
      setAddress(savedAddress);
    }
  }, []);

  return {
    isConnected,
    address,
    connect,
    disconnect,
  };
}