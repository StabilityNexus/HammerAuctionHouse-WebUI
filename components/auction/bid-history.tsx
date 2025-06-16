"use client";

import { motion } from "framer-motion";
import { Bid } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

interface BidHistoryProps {
  bids: Bid[];
}

export function BidHistory({ bids }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bids have been placed yet</p>
      </div>
    );
  }

  // Sort bids by timestamp, most recent first
  const sortedBids = [...bids].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
      {sortedBids.map((bid, index) => (
        <motion.div
          key={bid.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-sm">
                {`${bid.bidder.substring(0, 6)}...${bid.bidder.substring(38)}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
          <p className="font-semibold">{bid.amount} ETH</p>
        </motion.div>
      ))}
    </div>
  );
}