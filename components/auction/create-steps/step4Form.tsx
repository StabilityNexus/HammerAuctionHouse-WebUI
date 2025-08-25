import { AuctionFormData } from "@/app/create/page";
import { Button } from "@/components/ui/button";
import { getTokenName } from "@/lib/auction-service";
import { formatDuration } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";

interface Step4Form {
  currentStep: number;
  formData: AuctionFormData;
  goToPrevStep: () => void;
  handleFinalSubmit: () => void;
  isSubmitting?: boolean;
  isPending?: boolean;
  isConfirming?: boolean;
}

export function Step4Form({
  formData,
  currentStep,
  goToPrevStep,
  isSubmitting,
  isPending,
  isConfirming,
  handleFinalSubmit,
}: Step4Form) {
  const auctionType = formData.type;
  const tokenType = formData.auctionType;
  const biddingTokenAddress = formData.biddingTokenAddress;
  const auctionedTokenAddress = formData.auctionedTokenAddress;
  const {chain} = useAccount();
  const nativeTokenSymbol = chain?.nativeCurrency.symbol;
    const [bidTokenSymbol,setBidTokenSymbol] = useState("");
    const [auctionedTokenSymbol,setAuctionedTokenSymbol] = useState("");
    const client = usePublicClient();
    const fetchBiddingTokenSymbol = async()=>{
      if(!client) return;
      try {
        const bidsymbol = await getTokenName(client,biddingTokenAddress);
        setBidTokenSymbol(bidsymbol);
        const auctionedSymbol = await getTokenName(client,auctionedTokenAddress);
        setAuctionedTokenSymbol(auctionedSymbol);
      } catch (error) {
        console.error("Error occured while fetching token symbol: ",error);
      }
    }
  
    useEffect(()=>{
      fetchBiddingTokenSymbol();
    },[client]);
  

  // Duration
  let durationLabel = "-";
  if (auctionType === "vickrey") {
    durationLabel = `Commit: ${formatDuration(
      Number(formData.commitDuration)
    )} | Reveal: ${formatDuration(Number(formData.revealDuration))}`;
  } else {
    durationLabel = formatDuration(Number(formData.duration));
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="aspect-square relative w-28 h-28 rounded-lg overflow-hidden bg-muted">
          <img
            src={formData.imageUrl}
            alt="Auction preview"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">
            {formData.title || "Untitled Auction"}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {formData.description || "No description provided."}
          </p>
        </div>
      </div>
      <div className="border rounded-lg p-4 bg-muted/20 space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-muted-foreground">Auction Type</div>
          <div className="font-medium capitalize">{auctionType}</div>
          <div className="text-muted-foreground">Auction Duration</div>
          <div className="font-medium">{durationLabel}</div>
          {auctionType === "english" || auctionType === "all-pay" ? (
            <>
              <div className="text-muted-foreground">Start Price</div>
              <div className="font-medium">{formData.startPrice} {bidTokenSymbol}</div>
              <div className="text-muted-foreground">Min Bid Increment</div>
              <div className="font-medium">{formData.minBidDelta} {bidTokenSymbol}</div>
              <div className="text-muted-foreground">Deadline Extension</div>
              <div className="font-medium">
                {formData.deadlineExtension} sec
              </div>
            </>
          ) : null}
          {auctionType === "dutch" ? (
            <>
              <div className="text-muted-foreground">Subtype</div>
              <div className="font-medium capitalize">{formData.subtype}</div>
              <div className="text-muted-foreground">Start Price</div>
              <div className="font-medium">{formData.startPrice} {bidTokenSymbol}</div>
              {formData.reservePrice && (
                <>
                  <div className="text-muted-foreground">Reserve Price</div>
                  <div className="font-medium">{formData.reservePrice} {bidTokenSymbol}</div>
                </>
              )}
              {(formData.subtype === "exponential" ||
                formData.subtype === "logarithmic") && (
                <>
                  <div className="text-muted-foreground">Decay Factor</div>
                  <div className="font-medium">{formData.decayFactor}</div>
                </>
              )}
            </>
          ) : null}
          {auctionType === "vickrey" ? (
            <>
              <div className="text-muted-foreground">Minimum Bid</div>
              <div className="font-medium">
                {formData.minBid} {bidTokenSymbol}
              </div>
              <div className="text-muted-foreground">Commit Fee</div>
              <div className="font-medium">
                {formData.commitFee} {nativeTokenSymbol}
              </div>
              <div className="text-muted-foreground">Commit Period</div>
              <div className="font-medium">
                {formatDuration(Number(formData.commitDuration))}
              </div>
              <div className="text-muted-foreground">Reveal Period</div>
              <div className="font-medium">
                {formatDuration(Number(formData.revealDuration))}
              </div>
            </>
          ) : null}
          <div className="col-span-2 border-t pt-2 mt-2" />
          <div className="text-muted-foreground">Bidding Token (ERC20)</div>
          <div className="font-medium break-all">
            {formData.biddingTokenAddress}
          </div>
          <div className="text-muted-foreground">Auctioned Token Type</div>
          <div className="font-medium">{tokenType}</div>
          <div className="text-muted-foreground">
            {tokenType === "NFT"
              ? "NFT Contract Address"
              : "ERC20 Token Address"}
          </div>
          <div className="font-medium break-all">
            {formData.auctionedTokenAddress}
          </div>
          {tokenType === "NFT" && (
            <>
              <div className="text-muted-foreground">NFT Token ID</div>
              <div className="font-medium">{formData.tokenId}</div>
            </>
          )}
          {tokenType === "ERC20" && (
            <>
              <div className="text-muted-foreground">ERC20 Token Amount</div>
              <div className="font-medium">{formData.tokenAmount} {auctionedTokenSymbol}</div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-8 pt-4 border-t">
        <Button
          variant="outline"
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleFinalSubmit}
          disabled={isSubmitting || isPending || isConfirming}
          type="button"
        >
          {isPending && "Confirm in Wallet..."}
          {isConfirming && "Confirming Transaction..."}
          {!isPending && !isConfirming && isSubmitting && "Creating..."}
          {!isPending && !isConfirming && !isSubmitting && "Create Auction"}
        </Button>
      </div>
    </div>
  );
}
