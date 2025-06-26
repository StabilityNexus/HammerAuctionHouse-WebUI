"use client";

import { useEffect, useState } from "react";
import { AuctionGrid } from "@/components/auction/auction-grid";
import { AuctionFilter } from "@/components/auction/auction-filter";
import { mockAuctions, AuctionType, Auction } from "@/lib/mock-data";
import { usePublicClient } from "wagmi";
import { getAuctionService } from "@/lib/auction-service";

export default function AuctionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<AuctionType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [fetchedAuctions, setFetchedAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  const fetchAllPayAuctions = async () => {
    if (!publicClient) return;
    
    setIsLoading(true);
    try {
      const allPayService = getAuctionService("AllPay");
      
      // First try the new counter-based approach
      console.log("Fetching AllPay auctions using counter-based approach...");
      const counter = await allPayService.getAuctionCounter();
      console.log("AllPay auction counter:", counter.toString());
      
      let auctions: any[] = [];
      
      if (counter > BigInt(0)) {
        // Use counter-based fetching for last 10 auctions
        auctions = await allPayService.getLastNAuctions(10);
        console.log("Fetched auctions from counter:", auctions.length);
      } else {
        console.log("No auctions found via counter, trying event-based fallback...");
        // Fallback to event-based approach
        const currentBlock = await publicClient.getBlockNumber();
        const startBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
        auctions = await allPayService.getAllAuctions(publicClient, startBlock, currentBlock);
      }
      
      // Convert raw auction data to our Auction interface format
      const formattedAuctions: Auction[] = auctions.map((auction: any, index: number) => ({
        protocol: "AllPay" as AuctionType,
        id: auction.id?.toString() || auction.Id?.toString() || index.toString(),
        name: auction.name || "Unknown Auction",
        description: auction.description || "No description available",
        imgUrl: auction.imgUrl || "/placeholder.jpg",
        auctioneer: auction.auctioneer || "0x0000000000000000000000000000000000000000",
        auctionType: auction.auctionType?.toString() || "0",
        auctionedToken: auction.auctionedToken || "0x0000000000000000000000000000000000000000",
        auctionedTokenIdOrAmount: BigInt(auction.auctionedTokenIdOrAmount || 0),
        biddingToken: auction.biddingToken || "0x0000000000000000000000000000000000000000",
        startingBid: BigInt(auction.startingBid || 0),
        minBidDelta: BigInt(auction.minBidDelta || 0),
        highestBid: BigInt(auction.highestBid || 0),
        winner: auction.winner || "0x0000000000000000000000000000000000000000",
        deadline: BigInt(auction.deadline || Date.now() + 86400000), // Default to 1 day from now
        deadlineExtension: BigInt(auction.deadlineExtension || 0),
        isClaimed: auction.isClaimed || false,
      }));
      
      console.log("Formatted auctions:", formattedAuctions.length);
      setFetchedAuctions(formattedAuctions);
    } catch (error) {
      console.error("Error fetching AllPay auctions:", error);
      // Fallback to mock data
      setFetchedAuctions(mockAuctions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Use mock data initially, then try to fetch real data
    setFetchedAuctions([]);
    fetchAllPayAuctions().catch(console.error);
  }, [publicClient]);

  // Combine mock data with fetched data for demo purposes
  const allAuctions = [...fetchedAuctions];

  // Filter auctions based on search and filters
  const filteredAuctions = allAuctions.filter((auction) => {
    const matchesSearch =
      auction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(auction.protocol);

    // Calculate status based on current time and deadline
    const now = Date.now();
    const deadline = Number(auction.deadline);
    const status = now < deadline ? "active" : "ended";
    
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(status);

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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading AllPay auctions...</p>
              </div>
            </div>
          ) : (
            <AuctionGrid auctions={filteredAuctions} />
          )}
        </div>
      </div>
    </div>
  );
}
