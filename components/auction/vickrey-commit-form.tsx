"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Auction } from "@/lib/types";
import { Info, Lock, Hash } from "lucide-react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { VickreyAuctionService } from "@/lib/services/vickrey-auction-service";
import { toast } from "sonner";
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
import { decode } from "@/lib/storage";
import { formatEther } from "ethers";

interface VickreyCommitFormProps {
  auction: Auction;
}

export function VickreyCommitForm({ auction }: VickreyCommitFormProps) {
  const { isConnected, address } = useAccount();
  const [bidAmount, setBidAmount] = useState<string>("");
  const [salt, setSalt] = useState<string>("");
  const [commitment, setCommitment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auctionId = decode(auction.id).id;
  const chainId = useChainId();
  const { chain } = useAccount();
  const nativeTokenSymbol = chain?.nativeCurrency.symbol;
  const commitFee = formatEther(auction.commitFee!)

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    // isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const isValidBid = !isNaN(parseFloat(bidAmount)) && parseFloat(bidAmount) > 0;
  const isValidSalt = salt.length >= 8; // Minimum salt length

  // Generate cryptographically secure random salt
  const generateRandomSalt = () => {
    const array = new Uint8Array(32); // 32 bytes = 256 bits for strong security
    crypto.getRandomValues(array);
    const salt = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setSalt(salt);
  };

  // Generate commitment hash
  const generateCommitment = () => {
    if (!isValidBid || !isValidSalt) {
      toast.error("Please enter a valid bid amount and salt");
      return;
    }

    try {
      const bidAmountWei = BigInt(Math.floor(parseFloat(bidAmount) * 1e18));
      const commitmentHash = VickreyAuctionService.generateCommitment(
        bidAmountWei,
        salt
      );
      setCommitment(commitmentHash);
      toast.success("Commitment generated! You can now submit your bid.");
    } catch (error) {
      console.error("Error generating commitment:", error);
      toast.error("Failed to generate commitment");
    }
  };

  const handleSubmit = async () => {
    if (!address || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!commitment) {
      toast.error("Please generate a commitment first");
      return;
    }

    // Check if auction is in commit phase
    const now = Date.now();
    const commitEndTime = Number(auction.bidCommitEnd) * 1000;

    if (now >= commitEndTime) {
      toast.error("Commit phase has ended");
      return;
    }

    setIsSubmitting(true);
    try {
      const vickreyService = new VickreyAuctionService(chainId);
      await vickreyService.commitBid(
        writeContract,
        BigInt(auctionId),
        commitment as `0x${string}`
      );

      // Store commitment details locally for reveal phase
      const commitmentData = {
        auctionId: auction.id,
        bidAmount,
        salt,
        commitment,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        `vickrey_commitment_${BigInt(auctionId)}_${address.toLowerCase()}`,
        JSON.stringify(commitmentData)
      );
      toast.success("Commitment submitted successfully!");
    } catch (error) {
      console.error("Error submitting commitment:", error);
      toast.error("Failed to submit commitment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-muted p-4 rounded-lg text-center">
        <p className="mb-4">Connect your wallet to commit a bid</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm ">
            <p className="font-medium">Commit Phase - Sealed Bid Auction</p>
            <p>
              In Vickrey auctions, you commit to a sealed bid during the commit
              phase. Your actual bid amount is hidden until the reveal phase.
            </p>
            <p>
              <strong>Important:</strong> Save your bid amount and salt securely
              - you&apos;ll need them to reveal your bid later!
            </p>
            <p>Commit fee: {commitFee} {" "} {nativeTokenSymbol} (refunded upon reveal)</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bidAmount">Bid Amount (ETH)</Label>
          <Input
            id="bidAmount"
            type="number"
            step="0.001"
            placeholder="Enter your bid amount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="salt">Salt (Secret Key)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateRandomSalt}
            >
              Generate Random
            </Button>
          </div>
          <Input
            id="salt"
            type="text"
            placeholder="Enter a secret salt (min 8 chars)"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
        </div>
      </div>

      {/* 0x8524f93cd74f78c680c7acab2a90b1d91001e48eec8f7f4e91bdd7dfdb3b0998 */}

      {commitment && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4" />
            <Label className="font-medium">Generated Commitment Hash</Label>
          </div>
          <p className="text-sm font-mono break-all text-muted-foreground">
            {commitment}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={generateCommitment}
          disabled={!isValidBid || !isValidSalt}
          variant="outline"
          className="flex-1"
        >
          <Lock className="h-4 w-4 mr-2" />
          Generate Commitment
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={
                !commitment || isSubmitting || isPending || isConfirming
              }
              className="flex-1"
            >
              {isSubmitting || isPending || isConfirming
                ? "Submitting..."
                : "Submit Commitment"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Bid Commitment</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  You are about to commit to a sealed bid of{" "}
                  <strong>{bidAmount} ETH</strong>.
                </p>
                <p className="text-amber-600 dark:text-amber-400">
                  <strong>Important:</strong> Make sure to save your bid amount
                  ({bidAmount} ETH) and salt ({salt}) securely. You will need
                  these exact values to reveal your bid later!
                </p>
                <p>
                  A commitment fee of 0.001 ETH will be charged and refunded
                  when you reveal your bid.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Confirm Commitment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {writeError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Error: {writeError.message}
        </p>
      )}

      {confirmError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Transaction failed: {confirmError.message}
        </p>
      )}
    </div>
  );
}
