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
import { decode } from "@/lib/storage";
import { toast } from "sonner";
import { DutchAuctionPrice } from "@/components/auction/dutch-auction-price";
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
  const [currentDutchPrice, setCurrentDutchPrice] = useState<bigint>(BigInt(0));

  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
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

  // Fetch auction from contract using the appropriate service
  const fetchAuctionFromContract = async () => {
    if (!publicClient || !id) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching ${protocol} auction with ID:`, id);
      const auctionService = getAuctionService(protocol);
      const auctionData = await auctionService.getAuction(BigInt(id));
      setCurrentAuction(auctionData);
      console.log("Formatted auction data:", auctionData);

      // if (auctionData) {
      //   const formattedAuction: Auction = {
      //     protocol: protocol,
      //     id: auctionData.id?.toString() || id,
      //     name: auctionData.name || "Unknown Auction",
      //     description: auctionData.description || "No description available",
      //     imgUrl: auctionData.imgUrl || "/placeholder.jpg",
      //     auctioneer:
      //       auctionData.auctioneer ||
      //       "0x0000000000000000000000000000000000000000",
      //     auctionType: auctionData.auctionType?.toString() || "0",
      //     auctionedToken:
      //       auctionData.auctionedToken ||
      //       "0x0000000000000000000000000000000000000000",
      //     auctionedTokenIdOrAmount: BigInt(
      //       auctionData.auctionedTokenIdOrAmount || 0
      //     ),
      //     biddingToken:
      //       auctionData.biddingToken ||
      //       "0x0000000000000000000000000000000000000000",
      //     // Handle different auction types - Dutch auctions use startingPrice, others use startingBid
      //     startingBid: ["Linear", "Exponential", "Logarithmic"].includes(
      //       protocol
      //     )
      //       ? BigInt(auctionData.startingPrice || 0)
      //       : BigInt(auctionData.startingBid || 0),
      //     minBidDelta: BigInt(auctionData.minBidDelta || 0),
      //     highestBid: BigInt(auctionData.highestBid || 0),
      //     reservedPrice: BigInt(auctionData.reservedPrice || 0),
      //     startingPrice: BigInt(auctionData.startingPrice || 0), // For Dutch auctions
      //     decayFactor: BigInt(auctionData.decayFactor || 0), // For Exponential/Logarithmic Dutch auctions
      //     winner:
      //       auctionData.winner || "0x0000000000000000000000000000000000000000",
      //     deadline: BigInt(auctionData.deadline || Date.now() + 86400000),
      //     deadlineExtension: BigInt(auctionData.deadlineExtension || 0),
      //     duration: BigInt(auctionData.duration || 86400),
      //     isClaimed: auctionData.isClaimed || false,
      //     availableFunds: BigInt(auctionData.availableFunds || 0),
      //     // Vickrey-specific fields
      //     ...(protocol === "Vickrey" && {
      //       bidCommitEnd: BigInt(
      //         auctionData.bidCommitEnd || Date.now() + 86400000
      //       ),
      //       bidRevealEnd: BigInt(
      //         auctionData.bidRevealEnd || Date.now() + 172800000
      //       ),
      //       startTime: BigInt(auctionData.startTime || Date.now()),
      //       winningBid: BigInt(auctionData.winningBid || 0),
      //     }),
      //   };

      //   // For Dutch auctions, initialize current price with starting price
      //   if (["Linear", "Exponential", "Logarithmic"].includes(protocol)) {
      //     if (Number(formattedAuction.deadline) * 1000 < Date.now()) {
      //       setCurrentDutchPrice(BigInt(0));
      //     } else {
      //       setCurrentDutchPrice(BigInt(auctionData.startingPrice || 0));
      //     }
      //   }

      //   // Fetch bids after setting auction data
      //   // setTimeout(() => fetchBidsFromContract(), 100);
      // }
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

  // Handle Dutch auction purchase (for Dutch auctions, this replaces bidding)
  const handleDutchPurchase = useCallback(async () => {
    if (!currentAuction || !userAddress || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!["Linear", "Exponential", "Logarithmic"].includes(protocol)) {
      toast.error("This action is only available for Dutch auctions");
      return;
    }

    const auctionEnded = Date.now() >= Number(currentAuction.deadline) * 1000;
    if (auctionEnded) {
      toast.error("Auction has ended");
      return;
    }

    try {
      const auctionService = getAuctionService(protocol);
      await auctionService.withdrawItem(writeContract, BigInt(id));
      toast.success("Purchase transaction submitted!");
    } catch (error) {
      console.error("Error purchasing Dutch auction item:", error);
      toast.error("Failed to purchase item");
    }
  }, [currentAuction, userAddress, isConnected, protocol, id, writeContract]);

  // // Callback to refetch bids after successful bid placement
  // const handleBidPlaced = useCallback(
  //   async (newBid: Bid) => {
  //     // Add the new bid optimistically for immediate UI feedback
  //     setBids((prevBids) => [newBid, ...prevBids]);

  //     // Refetch from blockchain after a short delay to get the real data
  //     setTimeout(() => {
  //       fetchBidsFromContract();
  //     }, 2000);
  //   },
  //   [fetchBidsFromContract]
  // );

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

        {/* <motion.div
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
                  {["Linear", "Exponential", "Logarithmic"].includes(protocol)
                    ? "Current Price (Dutch Auction)"
                    : protocol === "Vickrey"
                    ? getVickreyPhase(currentAuction) === "ended"
                      ? "Winning Bid"
                      : "Vickrey Auction"
                    : "Current Price"}
                </p>
                <p className="text-3xl font-bold">
                  {["Linear", "Exponential", "Logarithmic"].includes(protocol)
                    ? currentAuction.isClaimed
                      ? "Sold"
                      : Date.now() >= Number(currentAuction.deadline) * 1000
                      ? "Auction Ended"
                      : (Number(currentDutchPrice) / 1e18).toFixed(4)
                    : protocol === "Vickrey"
                    ? (() => {
                        const phase = getVickreyPhase(currentAuction);
                        if (phase === "commit") {
                          return "Commit Phase";
                        } else if (phase === "reveal") {
                          return "Reveal Phase";
                        } else if (phase === "ended") {
                          return currentAuction.winningBid
                            ? (
                                Number(currentAuction.winningBid) / 1e18
                              ).toFixed(4)
                            : "No Winner";
                        }
                        return "Unknown";
                      })()
                    : bids.length > 0
                    ? Math.max(...bids.map((b) => b.amount))
                    : currentAuction.startingBid
                    ? Number(currentAuction.startingBid) / 1e18
                    : 0}{" "}
                  {["Linear", "Exponential", "Logarithmic"].includes(
                    protocol
                  ) &&
                  (currentAuction.isClaimed ||
                    Date.now() >= Number(currentAuction.deadline) * 1000)
                    ? ""
                    : protocol === "Vickrey" &&
                      (getVickreyPhase(currentAuction) === "commit" ||
                        getVickreyPhase(currentAuction) === "reveal" ||
                        (getVickreyPhase(currentAuction) === "ended" &&
                          !currentAuction.winningBid))
                    ? ""
                    : "ETH"}
                </p>
                {["Linear", "Exponential", "Logarithmic"].includes(
                  protocol
                ) && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div>
                      Starting:{" "}
                      {currentAuction.startingBid
                        ? (Number(currentAuction.startingBid) / 1e18).toFixed(4)
                        : 0}{" "}
                      ETH
                    </div>
                    <div>
                      Reserve:{" "}
                      {currentAuction.reservedPrice
                        ? (Number(currentAuction.reservedPrice) / 1e18).toFixed(
                            4
                          )
                        : 0}{" "}
                      ETH
                    </div>
                    {protocol === "Exponential" &&
                      currentAuction.decayFactor && (
                        <div>
                          Decay Factor:{" "}
                          {(Number(currentAuction.decayFactor) / 1e3).toFixed(
                            3
                          )}
                        </div>
                      )}
                  </div>
                )}

                {protocol === "Vickrey" && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div>
                      Phase:{" "}
                      {(() => {
                        const phase = getVickreyPhase(currentAuction);
                        switch (phase) {
                          case "commit":
                            return "Commit Phase - Submit sealed bids";
                          case "reveal":
                            return "Reveal Phase - Reveal your bids";
                          case "ended":
                            return "Auction Ended";
                          default:
                            return "Unknown";
                        }
                      })()}
                    </div>
                    {currentAuction.bidCommitEnd && (
                      <div>
                        Commit End:{" "}
                        {new Date(
                          Number(currentAuction.bidCommitEnd) * 1000
                        ).toLocaleString()}
                      </div>
                    )}
                    {currentAuction.bidRevealEnd && (
                      <div>
                        Reveal End:{" "}
                        {new Date(
                          Number(currentAuction.bidRevealEnd) * 1000
                        ).toLocaleString()}
                      </div>
                    )}
                    {getVickreyPhase(currentAuction) === "ended" &&
                      currentAuction.winner &&
                      currentAuction.winner !==
                        "0x0000000000000000000000000000000000000000" && (
                        <div>
                          Winner:{" "}
                          {`${currentAuction.winner.substring(
                            0,
                            6
                          )}...${currentAuction.winner.substring(38)}`}
                        </div>
                      )}
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">
                  {protocol === "Vickrey"
                    ? `${
                        getVickreyPhase(currentAuction) === "commit"
                          ? "Commit Phase"
                          : getVickreyPhase(currentAuction) === "reveal"
                          ? "Reveal Phase"
                          : "Auction"
                      } Status`
                    : "Auction Status"}
                </p>
                <CountdownTimer
                  endTime={
                    protocol === "Vickrey"
                      ? (() => {
                          const phase = getVickreyPhase(currentAuction);
                          if (phase === "commit") {
                            return (
                              Number(currentAuction.bidCommitEnd || 0) * 1000
                            );
                          } else if (phase === "reveal") {
                            return (
                              Number(currentAuction.bidRevealEnd || 0) * 1000
                            );
                          } else {
                            return (
                              Number(currentAuction.bidRevealEnd || 0) * 1000
                            );
                          }
                        })()
                      : Number(currentAuction.deadline) * 1000
                  }
                  startTime={
                    currentAuction.startTime
                      ? Number(currentAuction.startTime)
                      : Date.now()
                  }
                  status={
                    protocol === "Vickrey"
                      ? getVickreyPhase(currentAuction) === "ended"
                        ? "ended"
                        : "active"
                      : Date.now() < Number(currentAuction.deadline) * 1000
                      ? "active"
                      : "ended"
                  }
                />
              </div>
            </div>

            {(() => {
              if (protocol === "Vickrey") {
                const phase = getVickreyPhase(currentAuction);
                return (
                  (phase === "commit" || phase === "reveal") && (
                    <BidForm
                      auction={currentAuction}
                      onBidPlaced={handleBidPlaced}
                    />
                  )
                );
              } else {
                return (
                  Date.now() < Number(currentAuction.deadline) * 1000 && (
                    <BidForm
                      auction={currentAuction}
                      onBidPlaced={handleBidPlaced}
                    />
                  )
                );
              }
            })()}

            {(() => {
              if (protocol === "Vickrey") {
                const phase = getVickreyPhase(currentAuction);
                return (
                  phase === "ended" && (
                    <div className="bg-muted p-4 rounded-lg flex items-start">
                      <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">
                          This Vickrey auction has ended
                        </p>
                        {currentAuction.winningBid &&
                        Number(currentAuction.winningBid) > 0 ? (
                          <p className="text-muted-foreground">
                            Winning bid:{" "}
                            {(Number(currentAuction.winningBid) / 1e18).toFixed(
                              4
                            )}{" "}
                            ETH
                          </p>
                        ) : (
                          <p className="text-muted-foreground">
                            No valid bids were revealed for this auction
                          </p>
                        )}
                      </div>
                    </div>
                  )
                );
              } else {
                return (
                  Date.now() >= Number(currentAuction.deadline) * 1000 && (
                    <div className="bg-muted p-4 rounded-lg flex items-start">
                      <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">This auction has ended</p>
                        {bids.length > 0 ? (
                          <p className="text-muted-foreground">
                            Final price:{" "}
                            {Math.max(...bids.map((b) => b.amount))} ETH
                          </p>
                        ) : (
                          <p className="text-muted-foreground">
                            No bids were placed on this auction
                          </p>
                        )}
                      </div>
                    </div>
                  )
                );
              }
            })()}
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
        </motion.div> */}
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
