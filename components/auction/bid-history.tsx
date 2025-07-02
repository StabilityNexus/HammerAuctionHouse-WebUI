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
                  {bid.amount} 
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}