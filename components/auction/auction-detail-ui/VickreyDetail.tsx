import { Auction, Bid } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { CountdownTimer } from "../countdown-timer";
import { BidForm } from "../bid-form";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuctionInfo } from "../auction-info";
import { useCallback, useEffect, useState } from "react";
import { getAuctionService } from "@/lib/auction-service";
import { BidVariationChart } from "../bid-variation-chart";
import { BidHistory } from "../bid-history";
import { decode } from "@/lib/storage";

interface VickreyDetailProps {
  currentAuction: Auction;
  publicClient: any;
}

export function VickreyDetail({
  currentAuction,
  publicClient,
}: VickreyDetailProps) {
  const auctionId = decode(currentAuction.id).id;
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  const fetchBidsFromContract = useCallback(async () => {
    if (
      !publicClient ||
      Number(currentAuction.bidCommitEnd) * 1000 > Date.now()
    )
      return;
    setIsLoadingBids(true);
    try {
      const auctionService = await getAuctionService(currentAuction.protocol);
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

  useEffect(() => {
    if (currentAuction && publicClient) {
      fetchBidsFromContract();
    }
  }, [fetchBidsFromContract]);

  const getVickreyPhase = (auction: Auction) => {
    const now = BigInt(Date.now());
    const commitEnd = Number(auction.bidCommitEnd) * 1000 || BigInt(0);
    const revealEnd = Number(auction.bidRevealEnd) * 1000 || BigInt(0);

    if (now < commitEnd) {
      return "commit";
    } else if (now < revealEnd) {
      return "reveal";
    } else {
      return "ended";
    }
  };
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

            <div className="mt-2 text-sm text-muted-foreground">
              <div>
                Phase:{" "}
                {(() => {
                  const phase = getVickreyPhase(currentAuction);
                  switch (phase) {
                    case "commit":
                      return "Commit Phase - Submit sealed bids";
                    case "reveal":
                      return "Reveal Phase - Reveal your bids";
                    case "ended":
                      return "Auction Ended";
                    default:
                      return "Unknown";
                  }
                })()}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">
              {getVickreyPhase(currentAuction) === "commit"
                ? "Commit Phase"
                : getVickreyPhase(currentAuction) === "reveal"
                ? "Reveal Phase"
                : "Auction"}{" "}
              Status
            </p>
            <CountdownTimer
              endTime={(() => {
                const phase = getVickreyPhase(currentAuction);
                if (phase === "commit") {
                  return Number(currentAuction.bidCommitEnd || 0) * 1000;
                } else if (phase === "reveal") {
                  return Number(currentAuction.bidRevealEnd || 0) * 1000;
                } else {
                  return Number(currentAuction.bidRevealEnd || 0) * 1000;
                }
              })()}
              startTime={Date.now()}
              status={
                getVickreyPhase(currentAuction) === "ended" ? "ended" : "active"
              }
            />
            {Date.now() >= Number(currentAuction.bidRevealEnd) * 1000 && (
              <p className="text-sm font-medium text-muted-foreground">
                {currentAuction.isClaimed
                  ? "Asset has been claimed"
                  : "Asset has not been claimed yet"}
              </p>
            )}
          </div>
        </div>

        {(() => {
          const phase = getVickreyPhase(currentAuction);
          return (
            (phase === "commit" || phase === "reveal") && (
              <BidForm auction={currentAuction} />
            )
          );
        })()}

        {(() => {
          const phase = getVickreyPhase(currentAuction);
          return (
            phase === "ended" && (
              <div className="bg-muted p-4 rounded-lg flex items-start">
                <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">This Vickrey auction has ended</p>
                  {currentAuction.winningBid &&
                  Number(currentAuction.winningBid) > 0 ? (
                    <p className="text-muted-foreground">
                      Winning bid:{" "}
                      {(Number(currentAuction.winningBid) / 1e18).toFixed(4)}{" "}
                      {currentAuction.biddingTokenName || "ETH"}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No valid bids were revealed for this auction
                    </p>
                  )}
                </div>
              </div>
            )
          );
        })()}
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
