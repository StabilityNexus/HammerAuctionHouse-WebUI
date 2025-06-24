"use client";

import { useEffect, useState } from "react";
import { AuctionGrid } from "@/components/auction/auction-grid";
import { AuctionFilter } from "@/components/auction/auction-filter";
import { mockAuctions, AuctionType, Auction } from "@/lib/mock-data";
import { usePublicClient } from "wagmi";
import { all_AllPay } from "@/AllPayAuction";
import { start } from "repl";
import { parseAbiItem } from "viem";
import { set } from "date-fns";

export default function AuctionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<AuctionType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [fetchedAuctions,setFetchedAuctions] = useState<Auction[]>([])
  const publicClient = usePublicClient({ chainId: 63 })!;
  const fetchAuctions = async () => {
    const end = await publicClient.getBlockNumber();
    const start = BigInt(Number(end) - 100000); // Fetch last 1000 blocks
    // const auctions = await all_AllPay(publicClient,fromBlock, toBlock);
    const auctions =await all_AllPay(publicClient,start,end);
    setFetchedAuctions(auctions);
  };

  useEffect(() => {
    fetchAuctions().catch(console.error);
  }, [publicClient]);

  // Filter auctions based on search and filters
  const filteredAuctions = fetchedAuctions.filter((auction) => {
    const matchesSearch =
      auction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(auction.protocol);

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
