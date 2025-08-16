"use client";

import { motion } from "framer-motion";
import { Bid, AuctionType } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

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
  const highestBid = (auctionProtocol!="Vickrey"? Math.max(...bids.map(bid => bid.amount)) : 0);


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
                  ? "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  : "bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  isHighestBid
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {`${bid.bidder.substring(0, 6)}...${bid.bidder.substring(38)}`}
                    </p>
                    {isHighestBid && (
                      <Badge variant="secondary" className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        Winner
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  isHighestBid 
                    ? "text-gray-900 dark:text-gray-100" 
                    : "text-gray-600 dark:text-gray-400"
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