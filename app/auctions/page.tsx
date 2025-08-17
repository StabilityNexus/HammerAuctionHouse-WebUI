"use client";

import { useEffect, useState, Suspense } from "react";
import { AuctionGrid } from "@/components/auction/auction-grid";
import { AuctionFilter } from "@/components/auction/auction-filter";
import { AuctionType, Auction } from "@/lib/mock-data";
import { useChainId, usePublicClient } from "wagmi";
import { getAuctionService } from "@/lib/auction-service";
import { decode } from "@/lib/storage";
import { AuctionDetail } from "./auction-detail";
import { useSearchParams } from "next/navigation";
import { ConnectButton } from "@/components/ui/wallet-button";

function AuctionsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<AuctionType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [fetchedAuctions, setFetchedAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();
  const auctionId = searchParams.get("id");
  const chainId = useChainId();
  const fetchAllPayAuctions = async () => {
    if (!publicClient) return [];
    try {
      const allPayService = await getAuctionService("AllPay",chainId);
      const auctions = await allPayService.getLastNAuctions(publicClient, 50);
      return auctions;
    } catch (error) {
      console.error("Error fetching AllPay auctions:", error);
      return [];
    }
  };

  const fetchEnglishAuctions = async () => {
    if (!publicClient) return [];
    try {
      const englishService = await getAuctionService("English",chainId);
      const auctions = await englishService.getLastNAuctions(publicClient, 50);
      return auctions;
    } catch (error) {
      console.error("Error fetching English auctions:", error);
      return [];
    }
  };

  const fetchLinearDutchAuctions = async () => {
    if (!publicClient) return [];
    try {
      const linearDutchService = await getAuctionService("Linear",chainId);
      const auctions = await linearDutchService.getLastNAuctions(
        publicClient,
        50
      );
      return auctions;
    } catch (error) {
      console.error("Error fetching Linear Dutch auctions:", error);
      return [];
    }
  };

  const fetchExponentialDutchAuctions = async () => {
    if (!publicClient) return [];
    try {
      const exponentialDutchService = await getAuctionService("Exponential",chainId);
      const auctions = await exponentialDutchService.getLastNAuctions(
        publicClient,
        50
      );
      return auctions;
    } catch (error) {
      console.error("Error fetching Exponential Dutch auctions:", error);
      return [];
    }
  };

  const fetchLogarithmicDutchAuctions = async () => {
    if (!publicClient) return [];
    try {
      const logarithmicDutchService = await getAuctionService("Logarithmic",chainId);
      const auctions = await logarithmicDutchService.getLastNAuctions(
        publicClient,
        50
      );
      return auctions;
    } catch (error) {
      console.error("Error fetching Logarithmic Dutch auctions:", error);
      return [];
    }
  };

  const fetchVickreyAuctions = async () => {
    if (!publicClient) return [];
    try {
      const vickreyService = await getAuctionService("Vickrey",chainId);
      const auctions = await vickreyService.getLastNAuctions(publicClient, 50);
      return auctions;
    } catch (error) {
      console.error("Error fetching Vickrey auctions:", error);
      return [];
    }
  };

  const fetchAllAuctions = async () => {
    if (!publicClient) return;
    setIsLoading(true);
    try {
      const [
        allPayAuctions,
        englishAuctions,
        linearDutchAuctions,
        exponentialDutchAuctions,
        logarithmicDutchAuctions,
        vickreyAuctions,
      ] = await Promise.all([
        fetchAllPayAuctions(),
        fetchEnglishAuctions(),
        fetchLinearDutchAuctions(),
        fetchExponentialDutchAuctions(),
        fetchLogarithmicDutchAuctions(),
        fetchVickreyAuctions(),
      ]);
      const allAuctions = [
        ...allPayAuctions,
        ...englishAuctions,
        ...linearDutchAuctions,
        ...exponentialDutchAuctions,
        ...logarithmicDutchAuctions,
        ...vickreyAuctions,
      ].filter((auction): auction is Auction => auction !== null);
      setFetchedAuctions(allAuctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFetchedAuctions([]);
    fetchAllAuctions().catch(console.error);
  }, [publicClient]);

  // Filter auctions based on search and filters
  const filteredAuctions = fetchedAuctions.filter((auction) => {
    const matchesSearch =
      auction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(auction.protocol);
    const now = Date.now();
    const deadline = Number(auction.deadline);
    const status = now < deadline ? "active" : "ended";
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(status);
    return matchesSearch && matchesType && matchesStatus;
  });

  if (auctionId) {
    const decoded = decode(auctionId);
    return (
      <AuctionDetail protocol={decoded.protocol} id={BigInt(decoded.id)} />
    );
  }

  if (!publicClient) {
    return (
      <div className="container w-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto z-10">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <h2 className="text-3xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground max-w-md">
              Please connect your wallet to browse and participate in auctions.
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container w-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto z-10">
        {/* <h1 className="text-3xl font-bold mb-6">Browse Auctions</h1> */}
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
              <p className="mt-4">
                Loading All-Pay, English, Linear Dutch, Exponential Dutch,
                Logarithmic Dutch, and Vickrey Auctions...
              </p>
            </div>
          ) : (
            <AuctionGrid auctions={filteredAuctions} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuctionsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      }
    >
      <AuctionsContent />
    </Suspense>
  );
}
