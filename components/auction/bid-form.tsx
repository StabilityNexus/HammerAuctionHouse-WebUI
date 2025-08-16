"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Auction } from "@/lib/mock-data";
import { Info, AlertCircle, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getAuctionService } from "@/lib/auction-service";
import { Address, formatEther } from "viem";
import { VickreyCommitForm } from "./vickrey-commit-form";
import { VickreyRevealForm } from "./vickrey-reveal-form";
import { append, decode } from "@/lib/storage";

interface BidFormProps {
  auction: Auction;
}

export function BidForm({ auction }: BidFormProps) {
  const { isConnected, address } = useAccount();
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const account  = useAccount();
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();
  const chainId = useChainId();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const auctionId = decode(auction.id).id;

  // Check if this is a reverse Dutch auction (Linear, Exponential, Logarithmic)
  const isReverseDutchAuction = [
    "Linear",
    "Exponential",
    "Logarithmic",
  ].includes(auction.protocol);
  const isVickreyAuction = auction.protocol === "Vickrey";

  const reservePrice = auction.reservedPrice
    ? Number(auction.reservedPrice) / 1e18
    : 0;
  const currentBid = auction.highestBid ? Number(auction.highestBid) / 1e18 : 0;
  const minDelta = auction.minBidDelta
    ? Number(auction.minBidDelta) / 1e18
    : 0.1;
  const minRaise = Number(auction.highestBid)?Number(formatEther(auction.minBidDelta?auction.minBidDelta:BigInt(0))).toFixed(4):Number(formatEther(auction.startingBid?auction.startingBid:BigInt(0))).toFixed(4);
  const isValidBid = isReverseDutchAuction
    ? true
    : !isNaN(parseFloat(bidAmount)) && parseFloat(bidAmount) >= parseFloat(minRaise);

  // Determine Vickrey auction phase
  const getVickreyPhase = () => {
    if (!isVickreyAuction) return null;

    const now = BigInt(Date.now());
    const commitEnd = auction.bidCommitEnd || BigInt(0);
    const revealEnd = auction.bidRevealEnd || BigInt(0);

    if (now < commitEnd * BigInt(1000)) {
      return "commit";
    } else if (now < revealEnd * BigInt(1000)) {
      return "reveal";
    } else {
      return "ended";
    }
  };

  const vickreyPhase = getVickreyPhase();

  // Update Dutch auction price for reverse Dutch auctions
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updatePrice = async () => {
      if (
        isReverseDutchAuction &&
        !auction.isClaimed &&
        Date.now() < Number(auction.deadline) * 1000
      ) {
        try {
          const auctionService = await getAuctionService(auction.protocol,chainId);
          if (auctionService.getCurrentPrice) {
            const price = await auctionService.getCurrentPrice(
              BigInt(auctionId)
            );
            setBidAmount((Number(price) / 1e18).toFixed(4));
          }
        } catch (error) {
          console.error("Error updating Dutch auction price:", error);
        }
      }
    };

    if (
      isReverseDutchAuction &&
      !auction.isClaimed &&
      Date.now() < Number(auction.deadline) * 1000
    ) {
      updatePrice();
      interval = setInterval(updatePrice, 5000); // Update every 5 seconds
    } else if (!isReverseDutchAuction) {
      const minBid = currentBid + minDelta;
      setBidAmount(minBid.toFixed(4));
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [auction, isReverseDutchAuction, currentBid, minDelta]);

  // Handle successful transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      setShowSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }, [isConfirmed, hash, auctionId, address, bidAmount]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError || confirmError) {
      console.error("Transaction error:", writeError || confirmError);
      setIsSubmitting(false);
    }
  }, [writeError, confirmError]);

  const handleSubmit = async () => {
    if (!isValidBid || !isConnected || !address || isSubmitting) return;

    // Prevent submission if auction is claimed or ended
    if (
      isReverseDutchAuction &&
      (auction.isClaimed || Date.now() >= Number(auction.deadline) * 1000)
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const auctionService = await getAuctionService(auction.protocol,chainId);
      if (isReverseDutchAuction) {
        await auctionService.withdrawItem(
          writeContract,
          BigInt(auctionId),
          auction.biddingToken
        );
      } else {
        // For other auction types, place a bid
        if(auctionService.placeBid === undefined){
          return;
        }
        await auctionService.placeBid(
          writeContract,
          BigInt(auctionId),
          BigInt(Math.floor(parseFloat(bidAmount) * 1e18)),
          auction.biddingToken as Address,
          BigInt(auction.auctionType || 0)
        );
      }
      const storeLocation = String(chainId) + account.address + "Bids"; 
      append(storeLocation, auction.protocol, auctionId);
    } catch (error) {
      console.error("Error submitting bid:", error);
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="mt-4">
        <div className="bg-muted p-4 rounded-lg flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Connect your wallet to{" "}
            {isReverseDutchAuction
              ? "purchase this item"
              : isVickreyAuction
              ? "participate in this auction"
              : "place a bid"}
            .
          </p>
        </div>
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <Button onClick={openConnectModal} className="w-full">
              Connect Wallet
            </Button>
          )}
        </ConnectButton.Custom>
      </div>
    );
  }

  // Handle Vickrey auction with commit/reveal phases
  if (isVickreyAuction) {
    return (
      <div className="mt-4 space-y-4">
        {vickreyPhase === "commit" && (
          <>
            <VickreyCommitForm auction={auction} />
          </>
        )}

        {vickreyPhase === "reveal" && (
          <>
            <div className="bg-50 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Reveal Phase Active</p>
                  <p className="text-xs mt-1">
                    Reveal your previously committed bid to be eligible for
                    winning.
                  </p>
                </div>
              </div>
            </div>
            <VickreyRevealForm auctionId={BigInt(auctionId)} />
          </>
        )}

        {vickreyPhase === "ended" && (
          <div className="bg-gray-50 dark:bg-gray-950/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 text-gray-600 mt-0.5" />
              <div>
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                  Auction Ended
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">
                  The bid reveal phase has ended. Check the results to see if
                  you won.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 space-y-4">
        <div>
          {isReverseDutchAuction ? (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium">Current Price</span>
                <span className="text-lg font-semibold">
                  {auction.isClaimed
                    ? "Sold"
                    : Date.now() >= Number(auction.deadline) * 1000
                    ? "Auction Ended"
                    : `${bidAmount} ${auction.biddingTokenName || "ETH"}`}
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>
                  Reserve Price: {reservePrice}{" "}
                  {auction.biddingTokenName || "ETH"}
                </span>
                <span>
                  Starting Price:{" "}
                  {Number(auction.startingBid || auction.startingPrice || 0) /
                    1e18}{" "}
                  ${auction.biddingTokenName || "ETH"}
                </span>
              </div>
              {auction.isClaimed ? (
                <div className="bg-background border rounded-lg p-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <p className="text-foreground text-sm font-medium">
                      Item Sold
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">
                    This auction has been completed and the item has been sold.
                  </p>
                </div>
              ) : Date.now() >= Number(auction.deadline) * 1000 ? (
                <div className="bg-background border rounded-lg p-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <p className="text-foreground text-sm font-medium">
                      Auction Ended
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">
                    This auction has ended and is no longer available for
                    purchase.
                  </p>
                </div>
              ) : (
                <div className="bg-background border rounded-lg p-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <p className="text-foreground text-sm font-medium">
                      Dutch Auction
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">
                    Price decreases over time. Buy now at the current price, or
                    wait for it to decrease further.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="bidAmount" className="text-sm font-medium">
                  Raise Bid Amount
                </label>
                <span className="text-xs text-muted-foreground">
                  {auction.highestBid?"Min. increment: ": "Min. Bid: "}
                  {minRaise} {auction.biddingTokenName || "ETH"}
                </span>
              </div>

              <div className="relative">
                <Input
                  id="bidAmount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={minRaise}
                  step="0.01"
                  className="pr-12"
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                  {auction.biddingTokenName || "ETH"}
                </div>
              </div>

              {!isValidBid && bidAmount && (
                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Bid must be at least {minRaise}{" "}
                  {auction.biddingTokenName || "ETH"}
                </p>
              )}
            </>
          )}
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-background border text-foreground p-4 rounded-lg flex items-start"
            >
              <Check className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">
                  {isReverseDutchAuction
                    ? "Purchase successful!"
                    : "Your bid has been placed successfully!"}
                </p>
                <p className="text-sm mt-1">
                  Transaction confirmed on the blockchain.
                </p>
              </div>
            </motion.div>
          )}

          {isPending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-background border text-foreground p-4 rounded-lg flex items-start"
            >
              <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
              <p>Please confirm the transaction in your wallet...</p>
            </motion.div>
          )}

          {isConfirming && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-background border text-foreground p-4 rounded-lg flex items-start"
            >
              <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
              <p>Transaction submitted! Waiting for blockchain confirmation...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full"
              disabled={
                !isValidBid ||
                isSubmitting ||
                isPending ||
                isConfirming ||
                (isReverseDutchAuction &&
                  (auction.isClaimed ||
                    Date.now() >= Number(auction.deadline) * 1000))
              }
            >
              {isPending && "Preparing Transaction..."}
              {isConfirming && "Confirming..."}
              {!isPending && !isConfirming && isSubmitting && "Processing..."}
              {!isPending &&
                !isConfirming &&
                !isSubmitting &&
                (isReverseDutchAuction
                  ? auction.isClaimed
                    ? "Sold"
                    : Date.now() >= Number(auction.deadline) * 1000
                    ? "Auction Ended"
                    : "Buy Now"
                  : "Place Bid")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isReverseDutchAuction
                  ? "Confirm Purchase"
                  : "Confirm your bid"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isReverseDutchAuction ? (
                  auction.isClaimed ? (
                    "This item has already been sold and is no longer available for purchase."
                  ) : Date.now() >= Number(auction.deadline) * 1000 ? (
                    "This auction has ended and is no longer available for purchase."
                  ) : (
                    <>
                      You are about to purchase {auction.name} for {bidAmount}{" "}
                      {auction.biddingTokenName || "ETH"}. This action cannot be
                      undone after confirmation.
                    </>
                  )
                ) : (
                  <>
                    You are about to raise your current bid by {bidAmount}{" "}
                    {auction.biddingTokenName || "ETH"} on {auction.name}. This
                    action cannot be undone after confirmation.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {!(
                isReverseDutchAuction &&
                (auction.isClaimed ||
                  Date.now() >= Number(auction.deadline) * 1000)
              ) && (
                <AlertDialogAction onClick={handleSubmit}>
                  {isReverseDutchAuction ? "Confirm Purchase" : "Confirm Bid"}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}


