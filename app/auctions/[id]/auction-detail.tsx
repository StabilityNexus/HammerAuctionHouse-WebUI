"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Info, Wallet, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Auction, AuctionType, Bid } from "@/lib/mock-data";
import { getAuctionService } from "@/lib/auction-service";
import { usePublicClient, useAccount, useWriteContract } from "wagmi";
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
      const auctionData = await auctionService.getAuction(
        BigInt(id),
        publicClient
      );
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
          The auction you&apos;re looking for doesn&apos;t exist or has been
          removed.
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

      <WinnerBanner
        auction={currentAuction}
        userAddress={userAddress}
        onWithdraw={handleWithdrawItem}
        isWithdrawing={isWithdrawingItem}
      />

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
            <div className="text-muted-foreground mt-1">
              <Separator />
              {currentAuction.description}
            </div>
          </div>
          {/* Withdrawal Buttons */}
          {isConnected && (
            <div className="mt-6 space-y-3">
              {/* Withdraw Funds Button - Only for auctioneer */}
              {userAddress?.toLowerCase() ===
                currentAuction.auctioneer.toLowerCase() &&
                ((currentAuction.protocol !== "Vickrey" &&
                  currentAuction.availableFunds! > 0) ||
                  (currentAuction.protocol === "Vickrey" &&
                    getVickreyPhase(currentAuction) === "ended")) &&
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
          <LinearDetail currentAuction={currentAuction} />
        )}

        {protocol === "Exponential" && (
          <ExponentialDetail currentAuction={currentAuction} />
        )}

        {protocol === "Logarithmic" && (
          <LogarithmicDetail currentAuction={currentAuction} />
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

// Add this component before the main AuctionDetail component
function WinnerBanner({
  auction,
  userAddress,
  onWithdraw,
  isWithdrawing,
}: {
  auction: Auction;
  userAddress?: string;
  onWithdraw: () => void;
  isWithdrawing: boolean;
}) {
  if (Date.now() < Number(auction.deadline) * 1000) return null;

  const isWinner = userAddress?.toLowerCase() === auction.winner?.toLowerCase();

  if(userAddress?.toLowerCase() === auction.auctioneer.toLowerCase()) {
    return ;
  }
  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border ${
          isWinner
            ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
            : "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-600"
        }`}
      >
        <div className="flex items-start gap-4 justify-center">
          <div
            className={`p-2 rounded-full ${
              isWinner
                ? "bg-green-100 dark:bg-green-900/40"
                : "bg-gray-100 dark:bg-gray-900/40"
            }`}
          >
            {isWinner ? (
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <Info className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3
              className={`font-semibold ${
                isWinner
                  ? "text-green-800 dark:text-green-200"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {isWinner ? "Congratulations! You won the auction!" : "Auction Ended"}
            </h3>
            <p
              className={`mt-1 text-sm ${
                isWinner
                  ? "text-green-700 dark:text-green-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {isWinner
                ? auction.isClaimed
                  ? "You have successfully claimed this item."
                  : "You can now withdraw your won item!"
                : "Unfortunately, you didn't win this auction. Check out other exciting auctions!"}
            </p>
          </div>
          {isWinner && !auction.isClaimed ? (
            <Button
              onClick={onWithdraw}
              disabled={isWithdrawing}
              className="shrink-0 dark:bg-white bg-black dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              <Package className="h-4 w-4 mr-2" />
              {isWithdrawing ? "Withdrawing..." : "Withdraw Item"}
            </Button>
          ) : !isWinner && (
            <Button
              asChild
              className="shrink-0 dark:bg-white bg-black dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              <Link href="/auctions">
                Browse More Auctions
              </Link>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
