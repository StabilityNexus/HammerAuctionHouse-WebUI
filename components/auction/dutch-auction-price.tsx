import { useEffect, useState } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { getAuctionService } from '@/lib/auction-service';
import { Button } from '../ui/button';
import { parseEther, formatEther } from 'viem';
import { AuctionType } from '@/lib/mock-data';

interface DutchAuctionPriceProps {
  auctionId: bigint;
  isEnded: boolean;
  onBuyout: () => void;
  protocol?: AuctionType; // Add protocol prop to determine which service to use
}

export function DutchAuctionPrice({ auctionId, isEnded, onBuyout, protocol = "Linear" }: DutchAuctionPriceProps) {
  const [currentPrice, setCurrentPrice] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      // Don't fetch if auction has ended
      if (isEnded) {
        setCurrentPrice(BigInt(0));
        return;
      }
      
      try {
        const dutchService = getAuctionService(protocol);
        if (dutchService.getCurrentPrice) {
          const price = await dutchService.getCurrentPrice(auctionId);
          setCurrentPrice(price);
        }
      } catch (error) {
        console.error('Error fetching current price:', error);
        // Set to 0 on error
        setCurrentPrice(BigInt(0));
      }
    };

    // Fetch price once when component mounts or dependencies change
    fetchCurrentPrice();
  }, [auctionId, protocol, isEnded]);

  const handleBuyout = async () => {
    if (!walletClient || isEnded) return;
    
    setIsLoading(true);
    try {
      const dutchService = getAuctionService(protocol);
      await dutchService.withdrawItem(walletClient, auctionId);
      onBuyout();
    } catch (error) {
      console.error('Error buying out auction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Current Price</h3>
        <p className="text-2xl font-bold">
          {isEnded ? "Auction Ended" : `${formatEther(currentPrice)} ETH`}
        </p>
      </div>
      
      {!isEnded && (
        <Button 
          onClick={handleBuyout} 
          disabled={isLoading || isEnded}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Buy Now'}
        </Button>
      )}
    </div>
  );
}
