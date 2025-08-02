import { Auction, Bid } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { formatEther } from "viem";
import { CountdownTimer } from "../countdown-timer";
import { BidForm } from "../bid-form";
import { Info } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getAuctionService } from "@/lib/auction-service";
import { BidVariationChart } from "../bid-variation-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuctionInfo } from "../auction-info";
import { BidHistory } from "../bid-history";
import { decode } from "@/lib/storage";
import { useAccount } from "wagmi";
interface EnglishDetailProps {
  currentAuction: Auction;
  publicClient: any;
}

export function EnglishDetail({
  currentAuction,
  publicClient,
}: EnglishDetailProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  const auctionId = decode(currentAuction.id).id;
  const [currentBid,setCurrentBid] = useState(BigInt(0));
  const { address: userAddress, isConnected } = useAccount();
  const fetchBidsFromContract = useCallback(async () => {
    if (!publicClient) return;
    setIsLoadingBids(true);
    try {
      console.log(
        `Fetching ${currentAuction.protocol} auction bids for ID:`,
        auctionId
      );
      const auctionService = getAuctionService(currentAuction.protocol);
      const currentBlock = await publicClient.getBlockNumber();
      const fromBlock =
        currentBlock > BigInt(10000000)
          ? currentBlock - BigInt(10000000)
          : BigInt(0);
      const bidHistory = await auctionService.getBidHistory(
        publicClient,
        BigInt(auctionId),
        fromBlock,
        currentBlock
      );
      console.log("Fetched bid history:", bidHistory);
      setBids(bidHistory);
    } catch (err) {
      console.error(
        `Error fetching ${currentAuction.protocol} auction bids:`,
        err
      );
    } finally {
      setIsLoadingBids(false);
    }
  }, [publicClient, currentAuction]);
  
  const fetchCurrentBid = async () => {
    if (!publicClient || !userAddress) return;
    try {
      const auctionService = getAuctionService("English");
      if (auctionService && auctionService.getCurrentBid) {
        const currentBid = await auctionService.getCurrentBid(
          publicClient,
          BigInt(auctionId),
          userAddress
        );
        setCurrentBid(currentBid);
      }
      console.log("current bid is", currentBid);
    } catch (error) {
      console.error("Error fetching current bid from contract: ", error);
    }
  };
  useEffect(() => {
    if (currentAuction && publicClient) {
      fetchBidsFromContract();
      fetchCurrentBid();
    }
  }, [fetchBidsFromContract]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h1 className="text-3xl font-bold">{currentAuction.name}</h1>
      <p className="text-muted-foreground mt-2 mb-4">
        Created by{" "}
        {`${currentAuction.auctioneer.substring(
          0,
          6
        )}...${currentAuction.auctioneer.substring(38)}`}
      </p>

      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Asset</p>
            <p className="text-3xl font-bold">
              {BigInt(currentAuction.auctionType) === BigInt(1)
                ? Number(
                    formatEther(currentAuction.auctionedTokenIdOrAmount)
                  ).toFixed(4)
                : `#${currentAuction.auctionedTokenIdOrAmount.toString()}`}{" "}
              {currentAuction.auctionedTokenName || "Item"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Auction Status</p>
            <CountdownTimer
              endTime={Number(currentAuction.deadline) * 1000}
              startTime={Date.now()}
              status={
                Date.now() < Number(currentAuction.deadline) * 1000
                  ? "active"
                  : "ended"
              }
            />
            {Date.now() >= Number(currentAuction.deadline) * 1000 && (
                <p className="text-sm font-medium text-muted-foreground">
                    {currentAuction.isClaimed ? "Asset has been claimed" : "Asset has not been claimed yet"}
                </p>
            )}
          </div>
        </div>

        {/* Add current bid display */}
        {isConnected && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground mb-1">
                  Your Current Bid
                </p>
                <p className="text-xl font-semibold">
                  {Number(currentBid) > 0
                    ? `${Number(formatEther(currentBid)).toFixed(4)} ${
                        currentAuction.biddingTokenName || "ETH"
                      }`
                    : "No active bid"}
                </p>
              </div>
            </div>
          </div>
        )}

        {Date.now() < Number(currentAuction.deadline) * 1000 && (
          <BidForm auction={currentAuction} />
        )}
        {Date.now() >= Number(currentAuction.deadline) * 1000 && (
          <div className="bg-muted p-4 rounded-lg flex items-start">
            <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">This auction has ended</p>
              {Number(currentAuction.highestBid) > 0 ? (
                <p className="text-muted-foreground">
                  Final price:{" "}
                  {Number(formatEther(currentAuction.highestBid!)).toFixed(4)}{" "}
                  {currentAuction.biddingTokenName || "ETH"}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  No bids were placed on this auction
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {(bids.length > 0 || isLoadingBids) && (
        <div className="mb-6">
          {isLoadingBids ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
              <span className="text-muted-foreground">
                Loading bid history...
              </span>
            </div>
          ) : (
            <BidVariationChart bids={bids} />
          )}
        </div>
      )}

      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Bid History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-4">
          <div className="space-y-4">
            <AuctionInfo auction={currentAuction} />
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          {isLoadingBids ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
              <span className="text-muted-foreground">
                Loading bid history...
              </span>
            </div>
          ) : (
            <BidHistory bids={bids} auctionProtocol={currentAuction.protocol} />
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
