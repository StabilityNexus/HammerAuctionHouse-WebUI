"use client";

import { useState } from "react";
import { AuctionGrid } from "@/components/auction/auction-grid";
import { AuctionFilter } from "@/components/auction/auction-filter";
import { mockAuctions, AuctionType } from "@/lib/mock-data";

export default function AuctionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<AuctionType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // Filter auctions based on search and filters
  const filteredAuctions = mockAuctions.filter((auction) => {
    const matchesSearch =
      auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(auction.type);

    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(auction.status);

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="container w-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto z-10">
        <h1 className="text-3xl font-bold mb-6">Browse Auctions</h1>

        <AuctionFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        <div className="mt-6">
          <AuctionGrid auctions={filteredAuctions} />
        </div>
      </div>
    </div>
  );
}
