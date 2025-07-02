"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Info, Wallet, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Auction, AuctionType, Bid } from "@/lib/mock-data";
import { getAuctionService } from "@/lib/auction-service";
import {
  usePublicClient,
  useAccount,
  useWriteContract,
} from "wagmi";
import { toast } from "sonner";
import { AllPayDetail } from "@/components/auction/auction-detail-ui/AllPayDetail";
import { EnglishDetail } from "@/components/auction/auction-detail-ui/EnglishDetail";
import { LinearDetail } from "@/components/auction/auction-detail-ui/LinearDetail";
import { ExponentialDetail } from "@/components/auction/auction-detail-ui/ExponentialDetail";
import { LogarithmicDetail } from "@/components/auction/auction-detail-ui/LogarithmicDetail";
import { VickreyDetail } from "@/components/auction/auction-detail-ui/VickreyDetail";

interface AuctionDetailProps {
  protocol: AuctionType;
  id: bigint;
}

export function AuctionDetail({ protocol, id }: AuctionDetailProps) {
  const [currentAuction, setCurrentAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWithdrawingFunds, setIsWithdrawingFunds] = useState(false);
  const [isWithdrawingItem, setIsWithdrawingItem] = useState(false);
  const publicClient = usePublicClient();
  const { address: userAddress, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const getVickreyPhase = (auction: Auction) => {
    if (auction.protocol !== "Vickrey") return null;

    const now = BigInt(Date.now());
    const commitEnd = Number(auction.bidCommitEnd) * 1000 || BigInt(0);
    const revealEnd = Number(auction.bidRevealEnd) * 1000 || BigInt(0);

    if (now < commitEnd) {
      return "commit";
    } else if (now < revealEnd) {
      return "reveal";
    } else {
      return "ended";
    }
  };

  const fetchAuctionFromContract = async () => {
    if (!publicClient) return;
    setIsLoading(true);
    setError(null);
    try {
      const auctionService = getAuctionService(protocol);
      const auctionData = await auctionService.getAuction(BigInt(id),publicClient);
      setCurrentAuction(auctionData);
    } catch (err) {
      console.error(`Error fetching ${protocol} auction from contract:`, err);
      setError(`Failed to fetch ${protocol} auction data from blockchain`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionFromContract();
  }, [publicClient, id]);

  const handleWithdrawFunds = useCallback(async () => {
    if (!currentAuction || !userAddress || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    if (userAddress.toLowerCase() !== currentAuction.auctioneer.toLowerCase()) {
      toast.error("Only the auctioneer can withdraw funds");
      return;
    }
    try {
      setIsWithdrawingFunds(true);
      const auctionService = getAuctionService(protocol);
      await auctionService.withdrawFunds(writeContract, BigInt(id));
      toast.success("Withdrawal transaction submitted!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds");
    } finally {
      setIsWithdrawingFunds(false);
    }
  }, [currentAuction, userAddress, isConnected, protocol, id, writeContract]);

  const handleWithdrawItem = useCallback(async () => {
    if (!currentAuction || !userAddress || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    const auctionEnded = Date.now() >= Number(currentAuction.deadline) * 1000;
    if (!auctionEnded) {
      toast.error("Auction must end before withdrawing item");
      return;
    }
    const highestBidder = currentAuction?.winner;
    if (
      !highestBidder ||
      userAddress.toLowerCase() !== highestBidder.toLowerCase()
    ) {
      toast.error("Only the winner can withdraw the item");
      return;
    }
    try {
      setIsWithdrawingItem(true);
      const auctionService = getAuctionService(protocol);
      await auctionService.withdrawItem(writeContract, BigInt(id));
      toast.success("Item withdrawal transaction submitted!");
    } catch (error) {
      console.error("Error withdrawing item:", error);
      toast.error("Failed to withdraw item");
    } finally {
      setIsWithdrawingItem(false);
    }
  }, [
    currentAuction,
    userAddress,
    isConnected,
    protocol,
    id,
    writeContract,
    bids,
  ]);

  // Handle transaction confirmations
  if (isLoading && !currentAuction) {
    return (
      <div className="container py-12 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-4">Loading Auction...</h1>
        <p className="text-muted-foreground">
          Fetching auction data from the blockchain...
        </p>
      </div>
    );
  }

  if (!currentAuction) {
    return (
      <div className="container py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Auction Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The auction you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/auctions">Back to Auctions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      {error && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              Blockchain Error
            </p>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
            {error}. Showing fallback data if available.
          </p>
        </div>
      )}

      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link href="/auctions" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Auctions
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Image and Description */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted rounded-xl overflow-hidden aspect-square relative"
          >
            <img
              src={currentAuction.imgUrl}
              alt={currentAuction.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4">
              <Badge
                status={
                  protocol === "Vickrey"
                    ? getVickreyPhase(currentAuction) === "ended"
                      ? "ended"
                      : "active"
                    : Date.now() < Number(currentAuction.deadline) * 1000
                    ? "active"
                    : "ended"
                }
                type={currentAuction.protocol}
              />
            </div>
          </motion.div>
          <div className="mt-4 max-h-40 overflow-y-auto pr-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground mt-1">
              <Separator />
              {currentAuction.description}
            </p>
          </div>
          {/* Withdrawal Buttons */}
          {isConnected && (
            <div className="mt-6 space-y-3">
              {/* Withdraw Funds Button - Only for auctioneer */}
              {userAddress?.toLowerCase() ===
                currentAuction.auctioneer.toLowerCase() &&
                currentAuction.availableFunds! > 0 &&
                (currentAuction.protocol != "English" ||
                  Date.now() >= Number(currentAuction.deadline) * 1000) && (
                  // Only show if there are funds to withdraw
                  <Button
                    onClick={handleWithdrawFunds}
                    disabled={isWithdrawingFunds}
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <Wallet className="h-4 w-4" />
                    {isWithdrawingFunds ? "Withdrawing..." : "Withdraw Funds"}
                  </Button>
                )}

              {/* Withdraw Item Button - Only for winner after auction ends */}
              {!currentAuction.isClaimed &&
                (() => {
                  const auctionEnded =
                    Date.now() >= Number(currentAuction.deadline) * 1000;
                  const highestBidder = currentAuction?.winner;
                  const isWinner =
                    highestBidder &&
                    userAddress?.toLowerCase() === highestBidder.toLowerCase();
                  return (
                    auctionEnded &&
                    isWinner && (
                      <Button
                        onClick={handleWithdrawItem}
                        disabled={isWithdrawingItem}
                        className="w-full flex items-center justify-center gap-2"
                        variant="outline"
                      >
                        <Package className="h-4 w-4" />
                        {isWithdrawingItem ? "Withdrawing..." : "Withdraw Item"}
                      </Button>
                    )
                  );
                })()}
            </div>
          )}
        </div>
        {/* Right column - Auction details */}
        {protocol === "AllPay" && (
          <AllPayDetail
            currentAuction={currentAuction}
            publicClient={publicClient}
          />
        )}

        {protocol === "English" && (
          <EnglishDetail
            currentAuction={currentAuction}
            publicClient={publicClient}
          />
        )}

        {protocol === "Vickrey" && (
          <VickreyDetail
            currentAuction={currentAuction}
            publicClient={publicClient}
          />
        )}

        {protocol === "Linear" && (
          <LinearDetail
            currentAuction={currentAuction}
          />
        )}

        {protocol === "Exponential" && (
          <ExponentialDetail
            currentAuction={currentAuction}
          />
        )}

        {protocol === "Logarithmic" && (
          <LogarithmicDetail
            currentAuction={currentAuction}
          />
        )}
      </div>
    </div>
  );
}

function Badge({ status, type }: { status: string; type: string }) {
  let bgColor = "bg-blue-500/10 text-blue-500";

  if (status === "active") {
    bgColor = "bg-green-500/10 text-green-500";
  } else if (status === "ended") {
    bgColor = "bg-gray-500/10 text-gray-500";
  }

  return (
    <div className={`px-3 py-1.5 rounded-lg font-medium text-sm ${bgColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)} •{" "}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </div>
  );
}

//TODOS:
//1.Add support for auctioneer to withdraw funds from auction and check auction balance
//2. Add support for winner to claim auctioned item after it ends
//3. Refactor code all-over and then replicate for english-auction
