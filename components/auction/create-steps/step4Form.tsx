import { Button } from "@/components/ui/button";
import { formatDuration, getDurationInSeconds } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface Step4Form {
  currentStep: number;
  formData: any;
  goToPrevStep: () => void;
  goToNextStep: () => void;
  updateFormData: (data: any) => void;
  handleFinalSubmit: () => void;
  isSubmitting?: boolean;
  isPending?: boolean;
  isConfirming?: boolean;
}

export function Step4Form({
  formData,
  updateFormData,
  currentStep,
  goToPrevStep,
  goToNextStep,
  isSubmitting,
  isPending,
  isConfirming,
  handleFinalSubmit,
}: Step4Form) {
  const auctionType = formData.type;
  const tokenType = formData.auctionType;

  // Duration
  let durationLabel = "-";
  if (auctionType === "vickrey") {
    durationLabel = `Commit: ${formatDuration(
      Number(formData.commitDuration)
    )} | Reveal: ${formatDuration(Number(formData.revealDuration))}`;
  } else {
    durationLabel = formatDuration(Number(formData.duration));
  }

  console.log("Reviewing auction data:", formData);

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
              <div className="font-medium">{formData.startPrice} ETH</div>
              <div className="text-muted-foreground">Min Bid Increment</div>
              <div className="font-medium">{formData.minBidDelta} ETH</div>
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
              <div className="font-medium">{formData.startPrice} ETH</div>
              {formData.reservePrice && (
                <>
                  <div className="text-muted-foreground">Reserve Price</div>
                  <div className="font-medium">{formData.reservePrice} ETH</div>
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
              <div className="text-muted-foreground">Commit Period</div>
              <div className="font-medium">
                {formatDuration(formData.commitDuration)}
              </div>
              <div className="text-muted-foreground">Reveal Period</div>
              <div className="font-medium">
                {formatDuration(formData.revealDuration)}
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
              <div className="font-medium">{formData.tokenAmount}</div>
            </>
          )}
        </div>
      </div>
      <div className="bg-blue-500/10 text-blue-500 p-4 rounded-lg">
        <p className="text-sm">
          By creating this auction, you agree to our Terms of Service and
          Auction Rules. Once published, your auction will be visible to all
          HammerChain users.
        </p>
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
