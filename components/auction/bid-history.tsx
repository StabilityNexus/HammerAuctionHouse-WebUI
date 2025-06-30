"use client";

import { motion } from "framer-motion";
import { Bid, AuctionType } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, DollarSign } from "lucide-react";

interface BidHistoryProps {
  bids: Bid[];
  auctionProtocol?: AuctionType;
}

/**
 * Displays a scrollable, animated list of auction bids with visual highlights for the highest bid and protocol-specific badges.
 *
 * Renders a message if no bids are present. Bids are sorted by most recent, and the highest bid is visually distinguished. If the auction protocol is "AllPay," each bid displays a "Paid" badge. The highest bid is marked as the winner.
 *
 * @param bids - Array of bid objects to display
 * @param auctionProtocol - Optional auction protocol type, affecting badge display
 */
export function BidHistory({ bids, auctionProtocol }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bids have been placed yet</p>
      </div>
    );
  }


  // Sort bids by timestamp, most recent first
  const sortedBids = [...bids].sort((a, b) => b.timestamp - a.timestamp);
  
  // Get unique bidders
  const highestBid = Math.max(...bids.map(bid => bid.amount));

  return (
    <div className="space-y-4">
      {/* AllPay Auction Stats */}
      {/* {auctionProtocol === "AllPay" && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800 dark:text-orange-200">AllPay Auction</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">Total Paid:</span>
              <span className="font-semibold text-green-600">{totalAmountPaid.toFixed(2)} ETH</span>
            </div>
            <div>
              <span className="text-muted-foreground">Unique Bidders:</span>
              <span className="font-semibold ml-1">{uniqueBidders.length}</span>
            </div>
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
            ⚠️ All bidders pay their bid amounts. Only the highest bidder wins the item.
          </p>
        </div>
      )} */}

      {/* Bid List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {sortedBids.map((bid, index) => {
          const isHighestBid = bid.amount === highestBid;
          return (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isHighestBid
                  ? "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800"
                  : "bg-card/50 hover:bg-card/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  isHighestBid
                    ? "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                    : "bg-primary/10 text-primary"
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">
                      {`${bid.bidder.substring(0, 6)}...${bid.bidder.substring(38)}`}
                    </p>
                    {isHighestBid && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Winner
                      </Badge>
                    )}
                    {auctionProtocol === "AllPay" && (
                      <Badge variant="outline" className="text-xs">
                        Paid
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  isHighestBid ? "text-blue-600 dark:text-blue-400" : ""
                }`}>
                  {bid.amount} ETH
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}