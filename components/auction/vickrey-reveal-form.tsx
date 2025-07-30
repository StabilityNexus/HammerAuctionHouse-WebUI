"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, AlertCircle, CheckCircle } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { getAuctionService } from "@/lib/auction-service";
import { VickreyAuctionService } from "@/lib/services/vickrey-auction-service";

interface VickreyRevealFormProps {
  auctionId: bigint;
  onRevealSuccess?: () => void;
}

interface CommitmentData {
  bidAmount: string;
  salt: string;
  commitmentHash: string;
  timestamp: number;
}

export function VickreyRevealForm({ auctionId, onRevealSuccess }: VickreyRevealFormProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [salt, setSalt] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [commitmentData, setCommitmentData] = useState<CommitmentData | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);

  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Load commitment data from localStorage on mount
  useEffect(() => {
    if (!address) return;

    const storageKey = `vickrey_commitment_${auctionId}_${address.toLowerCase()}`;
    const stored = localStorage.getItem(storageKey);
    console.log(stored);
    console.log(address);
    console.log(`vickrey_commitment_${auctionId}_${address.toLowerCase()}`);
    if (stored) {
      try {
        const data: CommitmentData = JSON.parse(stored);
        setCommitmentData(data);
        setBidAmount(data.bidAmount);
        setSalt(data.salt);
        setAutoFilled(true);
      } catch (error) {
        console.error("Failed to parse stored commitment data:", error);
      }
    }
  }, [address, auctionId]);

  // Handle successful transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log("Transaction confirmed:", hash);
      setSuccess(true);
      setIsRevealing(false);

      // Clear the stored commitment data after successful reveal
      if (address) {
        const storageKey = `vickrey_commitment_${auctionId}_${address.toLowerCase()}`;
        localStorage.removeItem(storageKey);
      }
      
      if (onRevealSuccess) {
        onRevealSuccess();
      }
    }
  }, [isConfirmed, hash, auctionId, address]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError || confirmError) {
      console.error("Transaction error:", writeError || confirmError);
      setError((writeError || confirmError)?.message || "Failed to reveal bid. Please try again.");
      setIsRevealing(false);
    }
  }, [writeError, confirmError]);

  const handleReveal = async () => {
    if (!address || !writeContract) {
      setError("Please connect your wallet");
      return;
    }

    setError("");
    setIsRevealing(true);

    try {
      const vickreyService = getAuctionService("Vickrey");
      const bidAmountWei = BigInt(Math.floor(parseFloat(bidAmount) * 1e18));
      
      await vickreyService.revealBid(
        writeContract,
        auctionId,
        bidAmountWei,
        salt
      );
    } catch (error: any) {
      console.error("Reveal error:", error);
      setError(error.message || "Failed to reveal bid. Please try again.");
      setIsRevealing(false);
    }
  };

  const loadFromStorage = () => {
    if (commitmentData) {
      setBidAmount(commitmentData.bidAmount);
      setSalt(commitmentData.salt);
      setAutoFilled(true);
    }
  };

  if (success) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center w-full">
            <CheckCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Bid Revealed Successfully!</h3>
            <p className="text-sm text-muted-foreground">
              Your bid has been revealed and is now part of the auction.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Reveal Your Bid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {autoFilled && (
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              Auto-filled with your commitment data from local storage.
            </AlertDescription>
          </Alert>
        )}

        {commitmentData && !autoFilled && (
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Found saved commitment data.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadFromStorage}
              >
                Load Data
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="bidAmount">Bid Amount</Label>
          <Input
            id="bidAmount"
            type="number"
            step="0.001"
            placeholder="Enter your original bid amount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            disabled={isRevealing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salt">Salt</Label>
          <Input
            id="salt"
            type="text"
            placeholder="Enter your original salt"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            disabled={isRevealing}
          />
          <p className="text-xs text-muted-foreground">
            Use the same salt you used when committing your bid.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleReveal}
          disabled={isRevealing || isPending || isConfirming || !bidAmount || !salt}
          className="w-full"
        >
          {isPending && "Preparing Transaction..."}
          {isConfirming && "Confirming..."}
          {!isPending && !isConfirming && isRevealing && "Processing..."}
          {!isPending && !isConfirming && !isRevealing && "Reveal Bid"}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Make sure to use the exact bid amount and salt from your commitment</p>
          <p>• You can only reveal during the reveal phase</p>
          <p>• Failed reveals cannot be retried with different values</p>
        </div>
      </CardContent>
    </Card>
  );
}
