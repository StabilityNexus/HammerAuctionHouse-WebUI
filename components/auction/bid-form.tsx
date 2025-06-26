"use client";

import { useState, useEffect } from "react";
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
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getAuctionService } from "@/lib/auction-service";
import { Address } from "viem";

interface BidFormProps {
  auction: Auction;
  onBidPlaced: (bid: Bid) => void;
}

export function BidForm({ auction, onBidPlaced }: BidFormProps) {
  const { isConnected, address } = useAccount();
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { 
    writeContract, 
    data: hash,
    isPending,
    error: writeError 
  } = useWriteContract();
  
  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle successful transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log("Transaction confirmed:", hash);
      
      // Create a bid object for immediate UI update
      const newBid: Bid = {
        id: uuidv4(),
        auctionId: auction.id,
        bidder: address || "",
        amount: parseFloat(bidAmount),
        timestamp: Date.now(),
      };

      onBidPlaced(newBid);
      setShowSuccess(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }, [isConfirmed, hash, auction.id, address, bidAmount, onBidPlaced]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError || confirmError) {
      console.error("Transaction error:", writeError || confirmError);
      setIsSubmitting(false);
    }
  }, [writeError, confirmError]);

  useEffect(() => {
    if (auction.protocol === "English" || auction.protocol === "AllPay") {
      const currentBid = auction.highestBid ? Number(auction.highestBid) / 1e18 : 0;
      const minDelta = auction.minBidDelta ? Number(auction.minBidDelta) / 1e18 : 0.1;
      setBidAmount((currentBid + minDelta).toFixed(2));
    }
  }, [auction]);

  const currentBid = auction.highestBid ? Number(auction.highestBid) / 1e18 : 0;
  const minDelta = auction.minBidDelta ? Number(auction.minBidDelta) / 1e18 : 0.1;
  const minBidAmount = currentBid + minDelta;
  const isValidBid = !isNaN(parseFloat(bidAmount)) && parseFloat(bidAmount) >= minBidAmount;

  const handleSubmit = async () => {
    if (!isValidBid || !isConnected || !address || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const auctionService = getAuctionService(auction.protocol);
      const bidAmountWei = BigInt(Math.floor(parseFloat(bidAmount) * 1e18));
      
      console.log("Placing bid:", {
        auctionId: auction.id,
        bidAmount: bidAmountWei,
        protocol: auction.protocol
      });
      
      // Use the service to place the bid, which will handle the writeContract call
      await auctionService.placeBid(
        writeContract,
        BigInt(auction.id),
        bidAmountWei,
        auction.biddingToken as Address,
        BigInt(auction.auctionType)
      );
      
    } catch (error) {
      console.error("Error placing bid transaction:", error);
      setIsSubmitting(false);
    }
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
              <div>
                <p className="font-medium">
                  Your bid has been placed successfully!
                </p>
                <p className="text-sm mt-1">
                  Transaction confirmed on the blockchain. Bid history will update shortly.
                </p>
              </div>
            </motion.div>
          )}
          
          {isPending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-blue-500/10 text-blue-500 p-4 rounded-lg flex items-start"
            >
              <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
              <p>
                Please confirm the transaction in your wallet...
              </p>
            </motion.div>
          )}
          
          {isConfirming && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-yellow-500/10 text-yellow-500 p-4 rounded-lg flex items-start"
            >
              <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
              <p>
                Transaction submitted! Waiting for blockchain confirmation...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full" 
              disabled={!isValidBid || isSubmitting || isPending || isConfirming}
            >
              {isPending && "Preparing Transaction..."}
              {isConfirming && "Confirming..."}
              {!isPending && !isConfirming && isSubmitting && "Processing..."}
              {!isPending && !isConfirming && !isSubmitting && "Place Bid"}
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
