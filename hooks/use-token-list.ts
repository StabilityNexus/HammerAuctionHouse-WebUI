import { useState, useEffect } from 'react';
import { TokenObject } from '@/components/token-picker';

// Cache object to store tokens by chainId
const tokenCache: Record<number, TokenObject[]> = {};

// Add testnet chain IDs
const TESTNET_CHAIN_IDS = new Set([63, 5115]); // ETC Testnet, Base Goerli

// Helper function to check if a chain is testnet
const isTestnet = (chainId: number) => TESTNET_CHAIN_IDS.has(chainId);

export const ChainIdToName: Record<number, string> = {
  1: "ethereum",
  61: "ethereum-classic",
  2001: "cardano's-milkomeda",
  137: "polygon-pos",
  56: "binance-smart-chain",
  8453: "base",
};

export function useTokenList(chainId: number) {
  const [tokens, setTokens] = useState<TokenObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      // Return cached tokens if available
      if (tokenCache[chainId]) {
        setTokens(tokenCache[chainId]);
        return;
      }

      setLoading(true);
      setError(null);

      // Check if chain is testnet
      if (isTestnet(chainId)) {
        setError(`Please manually input the token's contract address instead.`);
        setLoading(false);
        return;
      }

      // Check if chain is supported
      if (!ChainIdToName[chainId]) {
        setError(`Chain ID ${chainId} is not supported yet`);
        setLoading(false);
        return;
      }

      try {
        const dataUrl = `https://raw.githubusercontent.com/StabilityNexus/TokenList/main/${ChainIdToName[chainId]}-tokens.json`;
        const response = await fetch(dataUrl, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tokens: ${response.statusText}`);
        }

        const data = await response.json();
        // Cache the tokens
        tokenCache[chainId] = data;
        setTokens(data);
      } catch (error: unknown) {
        console.error("Token fetch error:", error);
        setError(error instanceof Error ? error.message : 'Failed to fetch tokens');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [chainId]);

  return { tokens, loading, error };
}
