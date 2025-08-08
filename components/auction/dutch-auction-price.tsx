import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { getAuctionService } from "@/lib/auction-service";
import { Button } from "../ui/button";
import { formatEther } from "viem";
import { AuctionType } from "@/lib/mock-data";

interface DutchAuctionPriceProps {
  auctionId: bigint;
  isEnded: boolean;
  onBuyout: () => void;
  protocol?: AuctionType; // Add protocol prop to determine which service to use
}

export function DutchAuctionPrice({
  auctionId,
  isEnded,
  onBuyout,
  protocol = "Linear",
}: DutchAuctionPriceProps) {
  const [currentPrice, setCurrentPrice] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const { writeContract } = useWriteContract();

  // Check if this is a reverse Dutch auction
  const isReverseDutchAuction = [
    "Linear",
    "Exponential",
    "Logarithmic",
  ].includes(protocol);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      // Don't fetch if auction has ended
      if (isEnded) {
        setCurrentPrice(BigInt(0));
        return;
      }

      try {
        const dutchService = await getAuctionService(protocol);
        if (dutchService.getCurrentPrice) {
          const price = await dutchService.getCurrentPrice(auctionId);
          setCurrentPrice(price);
        }
      } catch (error) {
        console.error("Error fetching current price:", error);
        // Set to 0 on error
        setCurrentPrice(BigInt(0));
      }
    };

    // Fetch price once when component mounts or dependencies change
    fetchCurrentPrice();

    // Update price periodically for reverse Dutch auctions
    let interval: NodeJS.Timeout;
    if (isReverseDutchAuction && !isEnded) {
      interval = setInterval(fetchCurrentPrice, 5000); // Update every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [auctionId, protocol, isEnded, isReverseDutchAuction]);

  const handleBuyout = async () => {
    if (!writeContract || isEnded) return;

    setIsLoading(true);
    try {
      const dutchService = await getAuctionService(protocol);
      await dutchService.withdrawItem(writeContract, auctionId);
      onBuyout();
    } catch (error) {
      console.error("Error buying out auction:", error);
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

      {/* Only show Buy Now button for non-reverse Dutch auctions */}
      {/* For reverse Dutch auctions (Linear, Exponential, Logarithmic), buy functionality is in BidForm */}
      {!isReverseDutchAuction && !isEnded && (
        <Button
          onClick={handleBuyout}
          disabled={isLoading || isEnded}
          className="w-full"
        >
          {isLoading ? "Processing..." : "Buy Now"}
        </Button>
      )}
    </div>
  );
}
