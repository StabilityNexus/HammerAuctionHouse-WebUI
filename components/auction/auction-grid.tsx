"use client";

import { AuctionCard } from "@/components/auction/auction-card";
import { Auction } from "@/lib/mock-data";

interface AuctionGridProps {
  auctions: Auction[];
}

export function AuctionGrid({ auctions }: AuctionGridProps) {
  if (auctions.length === 0) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center border rounded-lg bg-muted/20 p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No auctions found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}
