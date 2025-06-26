"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Info, Wallet, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/auction/countdown-timer";
import { AuctionInfo } from "@/components/auction/auction-info";
import { BidHistory } from "@/components/auction/bid-history";
import { BidForm } from "@/components/auction/bid-form";
import { BidVariationChart } from "@/components/auction/bid-variation-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Auction, getBidsForAuction, AuctionType, Bid } from "@/lib/mock-data";
import { getAuctionService } from "@/lib/auction-service";
import {
  usePublicClient,
  useBlockNumber,
  useAccount,
  useWriteContract,
} from "wagmi";
import { decodeCode } from "@/lib/storage";
import { toast } from "sonner";

interface AuctionDetailProps {
  auction: Auction | undefined;
  encodedAuctionId: string;
}

export function AuctionDetail({
  auction,
  encodedAuctionId,
}: AuctionDetailProps) {
  const [currentAuction, setCurrentAuction] = useState(auction);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWithdrawingFunds, setIsWithdrawingFunds] = useState(false);
  const [isWithdrawingItem, setIsWithdrawingItem] = useState(false);

  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { address: userAddress, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  // Decode the auction ID to get protocol and auction ID
  const decodedData = decodeCode(encodedAuctionId);
  const protocolNumber = decodedData.protocol;
  const auctionId = decodedData.id;

  // Map protocol numbers to protocol names
  const getProtocolName = (protocolNum: string): AuctionType => {
    switch (protocolNum) {
      case "1":
        return "AllPay";
      case "2":
        return "English";
      case "3":
        return "Linear";
      case "4":
        return "Logarithmic";
      case "5":
        return "Exponential";
      case "6":
        return "Vickrey";
      default:
        return "AllPay"; // fallback
    }
  };

  const protocolName = getProtocolName(protocolNumber);

  // Fetch bids from contract using the appropriate service
  const fetchBidsFromContract = useCallback(async () => {
    if (!publicClient || !auctionId || !currentAuction) return;

    setIsLoadingBids(true);
    try {
      console.log(`Fetching ${protocolName} auction bids for ID:`, auctionId);
      const auctionService = getAuctionService(protocolName);

      // Get current block number for event fetching
      const currentBlock = await publicClient.getBlockNumber();
      const fromBlock =
        currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);

      // Fetch bid history from blockchain events
      const bidHistory = await auctionService.getBidHistory(
        publicClient,
        BigInt(auctionId),
        fromBlock,
        currentBlock
      );

      console.log("Fetched bid history:", bidHistory);
      setBids(bidHistory);
    } catch (err) {
      console.error(`Error fetching ${protocolName} auction bids:`, err);
      // Fallback to mock data if contract fetch fails
      setBids(getBidsForAuction(auctionId));
    } finally {
      setIsLoadingBids(false);
    }
  }, [publicClient, auctionId, protocolName, currentAuction]);

  // Fetch auction from contract using the appropriate service
  const fetchAuctionFromContract = async () => {
    if (!publicClient || !auctionId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching ${protocolName} auction with ID:`, auctionId);
      const auctionService = getAuctionService(protocolName);
      const auctionData = await auctionService.getAuction(BigInt(auctionId));

      console.log("Fetched auction data:", auctionData);

      if (auctionData) {
        // Convert contract data to our Auction interface format
        const formattedAuction: Auction = {
          protocol: protocolName,
          id: auctionData.id?.toString() || auctionId,
          name: auctionData.name || "Unknown Auction",
          description: auctionData.description || "No description available",
          imgUrl: auctionData.imgUrl || "/placeholder.jpg",
          auctioneer:
            auctionData.auctioneer ||
            "0x0000000000000000000000000000000000000000",
          auctionType: auctionData.auctionType?.toString() || "0",
          auctionedToken:
            auctionData.auctionedToken ||
            "0x0000000000000000000000000000000000000000",
          auctionedTokenIdOrAmount: BigInt(
            auctionData.auctionedTokenIdOrAmount || 0
          ),
          biddingToken:
            auctionData.biddingToken ||
            "0x0000000000000000000000000000000000000000",
          startingBid: BigInt(auctionData.startingBid || 0),
          minBidDelta: BigInt(auctionData.minBidDelta || 0),
          highestBid: BigInt(auctionData.highestBid || 0),
          winner:
            auctionData.winner || "0x0000000000000000000000000000000000000000",
          deadline: BigInt(auctionData.deadline || Date.now() + 86400000),
          deadlineExtension: BigInt(auctionData.deadlineExtension || 0),
          isClaimed: auctionData.isClaimed || false,
          availableFunds: auctionData.availableFunds || BigInt(0),
        };

        setCurrentAuction(formattedAuction);
        // Fetch bids after setting auction data
        setTimeout(() => fetchBidsFromContract(), 100);
      }
    } catch (err) {
      console.error(
        `Error fetching ${protocolName} auction from contract:`,
        err
      );
      setError(`Failed to fetch ${protocolName} auction data from blockchain`);
      // Keep using fallback auction if available and fetch mock bids
      if (currentAuction) {
        setBids(getBidsForAuction(currentAuction.id));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auction) {
      setBids(getBidsForAuction(auction.id));
    }
  }, [auction]);

  useEffect(() => {
    // Try to fetch from contract first, fallback to provided auction
    fetchAuctionFromContract();
  }, [publicClient, auctionId]);

  // Refetch bids when block number changes (new transactions)
  useEffect(() => {
    if (currentAuction && publicClient && blockNumber) {
      fetchBidsFromContract();
    }
  }, [fetchBidsFromContract]);

  // Callback to refetch bids after successful bid placement
  const handleBidPlaced = useCallback(
    async (newBid: Bid) => {
      // Add the new bid optimistically for immediate UI feedback
      setBids((prevBids) => [newBid, ...prevBids]);

      // Refetch from blockchain after a short delay to get the real data
      setTimeout(() => {
        fetchBidsFromContract();
      }, 2000);
    },
    [fetchBidsFromContract]
  );

  // Handle funds withdrawal (for auctioneer)
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
      const auctionService = getAuctionService(protocolName);

      await auctionService.withdrawFunds(writeContract, BigInt(auctionId));

      toast.success("Withdrawal transaction submitted!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds");
    } finally {
      setIsWithdrawingFunds(false);
    }
  }, [
    currentAuction,
    userAddress,
    isConnected,
    protocolName,
    auctionId,
    writeContract,
  ]);

  // Handle item withdrawal (for winner)
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

    // In AllPay auctions, the winner is the highest bidder
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
      const auctionService = getAuctionService(protocolName);

      await auctionService.withdrawItem(writeContract, BigInt(auctionId));

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
    protocolName,
    auctionId,
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
          The auction you're looking for doesn't exist or has been removed.
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
                  Date.now() < Number(currentAuction.deadline) * 1000
                    ? "active"
                    : "ended"
                }
                type={currentAuction.protocol}
              />
            </div>
          </motion.div>
          {/* Description below image, scrollable if needed */}

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold">{currentAuction.name}</h1>
          <p className="text-muted-foreground mt-2 mb-4">
            Created by{" "}
            {`${currentAuction.auctioneer.substring(
              0,
              6
            )}...${currentAuction.auctioneer.substring(38)}`}
          </p>

          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current Price
                </p>
                <p className="text-3xl font-bold">
                  {bids.length > 0
                    ? Math.max(...bids.map((b) => b.amount))
                    : currentAuction.startingBid
                    ? Number(currentAuction.startingBid) / 1e18
                    : 0}{" "}
                  ETH
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">
                  Auction Status
                </p>
                <CountdownTimer
                  endTime={Number(currentAuction.deadline) * 1000}
                  startTime={
                    currentAuction.startTime
                      ? Number(currentAuction.startTime)
                      : Date.now()
                  }
                  status={
                    Date.now() < Number(currentAuction.deadline) * 1000
                      ? "active"
                      : "ended"
                  }
                />
              </div>
            </div>

            {Date.now() < Number(currentAuction.deadline) * 1000 && (
              <BidForm auction={currentAuction} onBidPlaced={handleBidPlaced} />
            )}

            {Date.now() >= Number(currentAuction.deadline) * 1000 && (
              <div className="bg-muted p-4 rounded-lg flex items-start">
                <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">This auction has ended</p>
                  {bids.length > 0 ? (
                    <p className="text-muted-foreground">
                      Final price: {Math.max(...bids.map((b) => b.amount))} ETH
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No bids were placed on this auction
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {(bids.length > 0 || isLoadingBids) && (
            <div className="mb-6">
              {isLoadingBids ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                  <span className="text-muted-foreground">
                    Loading bid history...
                  </span>
                </div>
              ) : (
                <BidVariationChart bids={bids} />
              )}
            </div>
          )}

          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">Bid History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <AuctionInfo auction={currentAuction} />
              </div>
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              {isLoadingBids ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                  <span className="text-muted-foreground">
                    Loading bid history...
                  </span>
                </div>
              ) : (
                <BidHistory
                  bids={bids}
                  auctionProtocol={currentAuction.protocol}
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
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
