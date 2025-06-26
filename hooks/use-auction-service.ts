import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { getAuctionService } from '@/lib/auction-service';
import { AuctionType, Bid } from '@/lib/mock-data';

export function useAuctionService(auctionType: AuctionType) {
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getAuctionService(auctionType);

  const fetchBidHistory = async (auctionId: bigint): Promise<Bid[]> => {
    if (!publicClient) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, use a reasonable block range
      const currentBlock = await publicClient.getBlockNumber();
      const startBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
      
      const bids = await service.getBidHistory(
        publicClient,
        auctionId,
        startBlock,
        currentBlock
      );
      
      return bids;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bid history');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuction = async (auctionId: bigint) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const auction = await service.getAuction(auctionId);
      return auction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch auction');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllAuctions = async () => {
    if (!publicClient) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const currentBlock = await publicClient.getBlockNumber();
      const startBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
      
      const auctions = await service.getAllAuctions(
        publicClient,
        startBlock,
        currentBlock
      );
      
      return auctions;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch auctions');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    service,
    isLoading,
    error,
    fetchBidHistory,
    fetchAuction,
    fetchAllAuctions,
  };
}
