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
    if (!publicClient) return [];
    
    try {
      const allPayService = getAuctionService("AllPay");
      console.log("Fetching AllPay auctions...");
      
      const currentBlock = await publicClient.getBlockNumber();
      const startBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
      const auctions = await allPayService.getAllAuctions(publicClient, startBlock, currentBlock);
      
      return auctions.map((auction: any, index: number) => ({
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
        deadline: BigInt(auction.deadline || Date.now() + 86400000),
        deadlineExtension: BigInt(auction.deadlineExtension || 0),
        isClaimed: auction.isClaimed || false,
      }));
    } catch (error) {
      console.error("Error fetching AllPay auctions:", error);
      return [];
    }
  };

  const fetchEnglishAuctions = async () => {
    if (!publicClient) return [];
    
    try {
      const englishService = getAuctionService("English");
      console.log("Fetching English auctions...");
      
      const currentBlock = await publicClient.getBlockNumber();
      const startBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
      const auctions = await englishService.getAllAuctions(publicClient, startBlock, currentBlock);
      
      return auctions.map((auction: any, index: number) => ({
        protocol: "English" as AuctionType,
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
        deadline: BigInt(auction.deadline || Date.now() + 86400000),
        deadlineExtension: BigInt(auction.deadlineExtension || 0),
        isClaimed: auction.isClaimed || false,
      }));
    } catch (error) {
      console.error("Error fetching English auctions:", error);
      return [];
    }
  };

  const fetchLinearDutchAuctions = async () => {
    if (!publicClient) return [];
    
    try {
      const linearDutchService = getAuctionService("Linear");
      console.log("Fetching Linear Dutch auctions...");
      
      const currentBlock = await publicClient.getBlockNumber();
      const startBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
      const auctions = await linearDutchService.getAllAuctions(publicClient, startBlock, currentBlock);
      
      return auctions.map((auction: any, index: number) => ({
        protocol: "Linear" as AuctionType,
        id: auction.id?.toString() || auction.Id?.toString() || index.toString(),
        name: auction.name || "Unknown Auction",
        description: auction.description || "No description available",
        imgUrl: auction.imgUrl || "/placeholder.jpg",
        auctioneer: auction.auctioneer || "0x0000000000000000000000000000000000000000",
        auctionType: auction.auctionType?.toString() || "0",
        auctionedToken: auction.auctionedToken || "0x0000000000000000000000000000000000000000",
        auctionedTokenIdOrAmount: BigInt(auction.auctionedTokenIdOrAmount || 0),
        biddingToken: auction.biddingToken || "0x0000000000000000000000000000000000000000",
        // For Dutch auctions, use startingPrice instead of startingBid
        startingPrice: BigInt(auction.startingPrice || 0),
        reservedPrice: BigInt(auction.reservedPrice || 0),
        // Dutch auctions don't have traditional bids, but we'll set this for UI compatibility
        highestBid: BigInt(0),
        currentPrice: BigInt(auction.startingPrice || 0), // Will be updated with current price
        availableFunds: BigInt(auction.availableFunds || 0),
        winner: auction.winner || "0x0000000000000000000000000000000000000000",
        deadline: BigInt(auction.deadline || Date.now() + 86400000),
        duration: BigInt(auction.duration || 86400),
        isClaimed: auction.isClaimed || false,
      }));
    } catch (error) {
      console.error("Error fetching Linear Dutch auctions:", error);
      return [];
    }
  };

  const fetchExponentialDutchAuctions = async () => {
    if (!publicClient) return [];
    
    try {
      const exponentialDutchService = getAuctionService("Exponential");
      console.log("Fetching Exponential Dutch auctions...");
      
      const currentBlock = await publicClient.getBlockNumber();
      const startBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
      const auctions = await exponentialDutchService.getAllAuctions(publicClient, startBlock, currentBlock);
      
      return auctions.map((auction: any, index: number) => ({
        protocol: "Exponential" as AuctionType,
        id: auction.id?.toString() || auction.Id?.toString() || index.toString(),
        name: auction.name || "Unknown Auction",
        description: auction.description || "No description available",
        imgUrl: auction.imgUrl || "/placeholder.jpg",
        auctioneer: auction.auctioneer || "0x0000000000000000000000000000000000000000",
        auctionType: auction.auctionType?.toString() || "0",
        auctionedToken: auction.auctionedToken || "0x0000000000000000000000000000000000000000",
        auctionedTokenIdOrAmount: BigInt(auction.auctionedTokenIdOrAmount || 0),
        biddingToken: auction.biddingToken || "0x0000000000000000000000000000000000000000",
        // For Dutch auctions, use startingPrice instead of startingBid
        startingPrice: BigInt(auction.startingPrice || 0),
        reservedPrice: BigInt(auction.reservedPrice || 0),
        decayFactor: BigInt(auction.decayFactor || 0),
        // Dutch auctions don't have traditional bids, but we'll set this for UI compatibility
        highestBid: BigInt(0),
        currentPrice: BigInt(auction.startingPrice || 0), // Will be updated with current price
        availableFunds: BigInt(auction.availableFunds || 0),
        winner: auction.winner || "0x0000000000000000000000000000000000000000",
        deadline: BigInt(auction.deadline || Date.now() + 86400000),
        duration: BigInt(auction.duration || 86400),
        isClaimed: auction.isClaimed || false,
      }));
    } catch (error) {
      console.error("Error fetching Exponential Dutch auctions:", error);
      return [];
    }
  };

  const fetchLogarithmicDutchAuctions = async () => {
    if (!publicClient) return [];
    
    try {
      const logarithmicDutchService = getAuctionService("Logarithmic");
      console.log("Fetching Logarithmic Dutch auctions...");
      
      const currentBlock = await publicClient.getBlockNumber();
      const startBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
      const auctions = await logarithmicDutchService.getAllAuctions(publicClient, startBlock, currentBlock);
      console.log("Fetched Logarithmic Dutch auctions:", auctions);
      return auctions.map((auction: any, index: number) => ({
        protocol: "Logarithmic" as AuctionType,
        id: auction.id?.toString() || auction.Id?.toString() || index.toString(),
        name: auction.name || "Unknown Auction",
        description: auction.description || "No description available",
        imgUrl: auction.imgUrl || "/placeholder.jpg",
        auctioneer: auction.auctioneer || "0x0000000000000000000000000000000000000000",
        auctionType: auction.auctionType?.toString() || "0",
        auctionedToken: auction.auctionedToken || "0x0000000000000000000000000000000000000000",
        auctionedTokenIdOrAmount: BigInt(auction.auctionedTokenIdOrAmount || 0),
        biddingToken: auction.biddingToken || "0x0000000000000000000000000000000000000000",
        // For Dutch auctions, use startingPrice instead of startingBid
        startingPrice: BigInt(auction.startingPrice || 0),
        reservedPrice: BigInt(auction.reservedPrice || 0),
        decayFactor: BigInt(auction.decayFactor || 0),
        // Dutch auctions don't have traditional bids, but we'll set this for UI compatibility
        highestBid: BigInt(0),
        currentPrice: BigInt(auction.startingPrice || 0), // Will be updated with current price
        availableFunds: BigInt(auction.availableFunds || 0),
        winner: auction.winner || "0x0000000000000000000000000000000000000000",
        deadline: BigInt(auction.deadline || Date.now() + 86400000),
        duration: BigInt(auction.duration || 86400),
        isClaimed: auction.isClaimed || false,
      }));
    } catch (error) {
      console.error("Error fetching Logarithmic Dutch auctions:", error);
      return [];
    }
  };

  const fetchAllAuctions = async () => {
    if (!publicClient) return;
    
    setIsLoading(true);
    try {
      const [allPayAuctions, englishAuctions, linearDutchAuctions, exponentialDutchAuctions, logarithmicDutchAuctions] = await Promise.all([
        fetchAllPayAuctions(),
        fetchEnglishAuctions(),
        fetchLinearDutchAuctions(),
        fetchExponentialDutchAuctions(),
        fetchLogarithmicDutchAuctions()
      ]);
      
      setFetchedAuctions([...allPayAuctions, ...englishAuctions, ...linearDutchAuctions, ...exponentialDutchAuctions, ...logarithmicDutchAuctions]);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setFetchedAuctions(mockAuctions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFetchedAuctions([]);
    fetchAllAuctions().catch(console.error);
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
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4">Loading All-Pay, English, Linear Dutch, Exponential Dutch, and Logarithmic Dutch Auctions...</p>
            </div>
          ) : (
            <AuctionGrid auctions={filteredAuctions} />
          )}
        </div>
      </div>
    </div>
  );
}
