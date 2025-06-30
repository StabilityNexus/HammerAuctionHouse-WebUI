"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, AlertCircle, CheckCircle } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { getAuctionService } from "@/lib/auction-service";
import { Address } from "viem";
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

/**
 * React component for revealing a bid in a Vickrey auction.
 *
 * Displays a form for users to input their original bid amount and salt, validates the inputs against stored commitment data, and submits the reveal transaction to the blockchain. If commitment data is found in local storage, the form can auto-fill or load the saved values. Shows success and error feedback, and optionally calls a callback on successful reveal.
 *
 * @param auctionId - The unique identifier of the Vickrey auction
 * @param onRevealSuccess - Optional callback invoked after a successful reveal
 * @returns The bid reveal form UI or a success confirmation card
 */
export function VickreyRevealForm({ auctionId, onRevealSuccess }: VickreyRevealFormProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [salt, setSalt] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [commitmentData, setCommitmentData] = useState<CommitmentData | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);

  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Load commitment data from localStorage on mount
  useEffect(() => {
    if (!address) return;

    const storageKey = `vickrey_commitment_${auctionId}_${address.toLowerCase()}`;
    const stored = localStorage.getItem(storageKey);
    
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

  // NQ2jfKugP6ZrtvPm
  //10


  const validateReveal = async (): Promise<boolean> => {
    if (!bidAmount || !salt) {
      setError("Both bid amount and salt are required");
      return false;
    }

    if (parseFloat(bidAmount) <= 0) {
      setError("Bid amount must be greater than 0");
      return false;
    }

    console.log("Validating reveal with bid amount:", bidAmount, "and salt:", salt);

    try {
      const bidAmountWei = BigInt(Math.floor(parseFloat(bidAmount) * 1e18));
      const generatedHash = VickreyAuctionService.generateCommitment(bidAmountWei, salt);
      console.log("Generated commitment hash:", generatedHash);

      // If we have stored commitment data, verify the hash matches
      if (commitmentData && generatedHash !== commitmentData.commitmentHash) {
        setError("Bid amount and salt don't match your original commitment");
        return false;
      }

      return true;
    } catch (error) {
      setError("Failed to validate commitment hash");
      return false;
    }
  };

  const handleReveal = async () => {
    if (!address || !writeContract) {
      setError("Please connect your wallet");
      return;
    }

    setError("");
    setIsRevealing(true);

    try {
      // Validate the reveal data
      const isValid = await validateReveal();
      if (!isValid) {
        setIsRevealing(false);
        return;
      }

      const vickreyService = getAuctionService("Vickrey");
      
      // Convert bid amount to wei (18 decimals)
      const bidAmountWei = BigInt(Math.floor(parseFloat(bidAmount) * 1e18));
      
      await (vickreyService as any).revealBid(
        writeContract,
        auctionId,
        bidAmountWei,
        salt
      );

      setSuccess(true);
      
      // Clear the stored commitment data after successful reveal
      if (address) {
        const storageKey = `vickrey_commitment_${auctionId}_${address.toLowerCase()}`;
        localStorage.removeItem(storageKey);
      }
      
      if (onRevealSuccess) {
        onRevealSuccess();
      }

    } catch (error: any) {
      console.error("Reveal error:", error);
      setError(error.message || "Failed to reveal bid. Please try again.");
    } finally {
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
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
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
          <Label htmlFor="bidAmount">Bid Amount (ETH)</Label>
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
          disabled={isRevealing || !bidAmount || !salt}
          className="w-full"
        >
          {isRevealing ? "Revealing..." : "Reveal Bid"}
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


//TODOS:
//1. Look into vickrey auction service and add it's new functions in IAuctionService Interface
//2. Look into validation logic and remove local storage for now


// kYQM08YNjGiabkjc
// 0x85733efed3cd6040b0db9a338cfbb820b7ffba4ed1bb0fd5434932fa8ec06a27