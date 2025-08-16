import { Auction } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { CountdownTimer } from "../countdown-timer";
import { BidForm } from "../bid-form";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuctionInfo } from "../auction-info";

interface ExponentialDetailProps {
  currentAuction: Auction;
}

export function ExponentialDetail({ currentAuction }: ExponentialDetailProps) {
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
                {currentAuction.isClaimed
                  ? "Asset has been claimed"
                  : "Asset has not been claimed yet"}
              </p>
            )}
          </div>
        </div>

        {Date.now() < Number(currentAuction.deadline) * 1000 && (
          <BidForm auction={currentAuction} />
        )}

        {Date.now() >= Number(currentAuction.deadline) * 1000 && (
          <div className="bg-muted p-4 rounded-lg flex items-start">
            <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">This auction has ended</p>
              {currentAuction.winner != currentAuction.auctioneer ? (
                <p className="text-muted-foreground">
                  Sold to: {currentAuction.winner.substring(0, 6)}...
                  {currentAuction.winner.substring(38)} at{" "}
                  {Number(formatEther(currentAuction.settlePrice!)).toFixed(4)}{" "}
                  {currentAuction.biddingTokenName}
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

      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-1">
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-4">
          <div className="space-y-4">
            <AuctionInfo auction={currentAuction} />
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
