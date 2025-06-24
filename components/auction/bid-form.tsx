"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Auction, Bid } from "@/lib/mock-data";
import { Info, AlertCircle, Check } from "lucide-react";
import { v4 as uuidv4 } from "@/lib/utils";
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
import { useAccount, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { placeBid } from "@/AllPayAuction";
import { Address } from "viem";

interface BidFormProps {
  auction: Auction;
  onBidPlaced: (bid: Bid) => void;
}

export function BidForm({ auction, onBidPlaced }: BidFormProps) {
  const { isConnected, address } = useAccount();
  const [bidAmount, setBidAmount] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  if (auction.protocol == "English" || auction.protocol == "AllPay") {
    setBidAmount(
      (
        Number(auction.highestBid!) + (Number(auction.minBidDelta) || 0.1)
      ).toFixed(2)
    );
  }

  const minBidAmount =
    Number(auction.highestBid!) + (Number(auction.minBidDelta) || 0.1);
  const isValidBid =
    !isNaN(parseFloat(bidAmount!)) && parseFloat(bidAmount!) >= minBidAmount;

  const handleSubmit = async () => {
    if (!isValidBid || !isConnected) return;
    const { data: hash, writeContract } = useWriteContract();
    setIsSubmitting(true);
    if (!writeContract) return;
    await placeBid(
      writeContract,
      BigInt(auction.id),
      BigInt(parseFloat(bidAmount!)),
      auction.biddingToken! as Address,
      BigInt(auction.auctionType)
    );
    const newBid: Bid = {
      id: uuidv4(),
      bidder: address!,
      amount: parseFloat(bidAmount!),
      timestamp: Date.now(),
    };

    onBidPlaced(newBid);
    setIsSubmitting(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
    // Simulate transaction processing
    // setTimeout(() => {

    // }, 1500);
  };

  if (!isConnected) {
    return (
      <div className="mt-4">
        <div className="bg-muted p-4 rounded-lg flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Connect your wallet to place a bid on this auction.
          </p>
        </div>
        <ConnectButton />
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="bidAmount" className="text-sm font-medium">
              Your Bid Amount
            </label>
            <span className="text-xs text-muted-foreground">
              Min. bid: {minBidAmount} ETH
            </span>
          </div>

          <div className="relative">
            <Input
              id="bidAmount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={minBidAmount}
              step="0.01"
              className="pr-12"
            />
            <div className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
              ETH
            </div>
          </div>

          {!isValidBid && bidAmount && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Bid must be at least {minBidAmount} ETH
            </p>
          )}
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-500/10 text-green-500 p-4 rounded-lg flex items-start"
            >
              <Check className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
              <p>
                Your bid has been placed successfully! The transaction has been
                confirmed.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" disabled={!isValidBid || isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Bid"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm your bid</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to place a bid of {bidAmount} ETH on{" "}
                {auction.name}. This action cannot be undone after confirmation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Confirm Bid
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
