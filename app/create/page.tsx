"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuctionCreationForm } from "@/components/auction/create-form";
import { CreateAuctionSteps } from "@/components/auction/create-steps";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  getAuctionService,
  EnglishAuctionParams,
  AllPayAuctionParams,
  DutchAuctionParams,
  VickreyAuctionParams,
  parseBidAmount,
} from "@/lib/auction-service";
import { ExponentialDutchAuctionParams } from "@/lib/services/exponential-dutch-auction-service";
import { LogarithmicDutchAuctionParams } from "@/lib/services/logarithmic-dutch-auction-service";
import { AuctionType } from "@/lib/mock-data";
import { Address } from "viem";
import { getDurationInSeconds } from "@/lib/utils";
import { append, decode } from "@/lib/storage";
import { get } from "lodash";

function transformFormDataToParams(formData: any, auctionType: AuctionType) {
  const baseParams = {
    name: formData.title,
    description: formData.description,
    imgUrl: formData.imageUrl || "/placeholder.jpg",
    auctionType: BigInt(formData.auctionType === "NFT" ? 0 : 1),
    auctionedToken: formData.auctionedTokenAddress as Address,
    auctionedTokenIdOrAmount: BigInt(
      formData.auctionType === "NFT"
        ? formData.tokenId || "1"
        : formData.tokenAmount || "100"
    ),
    biddingToken: formData.biddingTokenAddress as Address,
  };

  switch (auctionType) {
    case "English":
    case "AllPay": {
      const duration = formData.duration
        ? BigInt(formData.duration)
        : getDurationInSeconds(
            formData.days || "3",
            formData.hours || "0",
            formData.minutes || "0"
          );

      return {
        ...baseParams,
        startingBid: parseBidAmount(formData.startPrice || "0.1"),
        minBidDelta: parseBidAmount(formData.minBidDelta || "0.01"),
        duration,
        deadlineExtension: BigInt(
          parseInt(formData.deadlineExtension || "300")
        ), // 5 minutes default
      } as EnglishAuctionParams | AllPayAuctionParams;
    }

    case "Linear":
    case "Exponential":
    case "Logarithmic": {
      const duration = formData.duration
        ? BigInt(formData.duration)
        : getDurationInSeconds(
            formData.days || "3",
            formData.hours || "0",
            formData.minutes || "0"
          );

      const dutchParams: DutchAuctionParams = {
        ...baseParams,
        startingPrice: parseBidAmount(formData.startPrice || "1.0"),
        reservedPrice: parseBidAmount(formData.reservePrice || "0.1"),
        duration,
      };

      // Add decay factor for exponential/logarithmic (scaled by 10^5 for precision)
      if (auctionType === "Exponential") {
        const exponentialParams: ExponentialDutchAuctionParams = {
          ...dutchParams,
          decayFactor: BigInt(
            Math.floor(parseFloat(formData.decayFactor || "1.0") * 1e5)
          ),
        };
        return exponentialParams;
      } else if (auctionType === "Logarithmic") {
        const logarithmicParams: LogarithmicDutchAuctionParams = {
          ...dutchParams,
          decayFactor: BigInt(
            Math.floor(parseFloat(formData.decayFactor || "1.0") * 1e5)
          ),
        };
        return logarithmicParams;
      }

      return dutchParams;
    }

    case "Vickrey": {
      const commitDuration = formData.commitDuration
        ? BigInt(formData.commitDuration)
        : getDurationInSeconds(
            formData.commitDays || "1",
            formData.commitHours || "0",
            formData.commitMinutes || "0"
          );

      const revealDuration = formData.revealDuration
        ? BigInt(formData.revealDuration)
        : getDurationInSeconds(
            formData.revealDays || "1",
            formData.revealHours || "0",
            formData.revealMinutes || "0"
          );

      return {
        ...baseParams,
        bidCommitDuration: commitDuration,
        bidRevealDuration: revealDuration,
      } as VickreyAuctionParams;
    }

    default:
      throw new Error(`Unsupported auction type: ${auctionType}`);
  }
}

const steps = [
  "Basic Information",
  "Auction Settings",
  "Token Setup",
  "Review & Submit",
];

export default function CreateAuction() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    //Unified form data structure
    title: "",
    description: "",
    imageUrl: "",
    type: "english",
    subtype: "linear", // For Dutch auctions
    startPrice: "0.1",
    reservePrice: "",
    duration: "3",
    days: "3",
    hours: "0",
    minutes: "0",
    minBidDelta: "0.05",
    deadlineExtension: "300",
    decayFactor: "0.1",
    // Vickrey auction fields
    commitDays: "1",
    commitHours: "0",
    commitMinutes: "0",
    revealDays: "1",
    revealHours: "0",
    revealMinutes: "0",
    commitDuration: "",
    revealDuration: "",
    // Token fields
    tokenAddress: "",
    biddingTokenAddress: "0x0000000000000000000000000000000000000000", // ETH placeholder
    auctionedTokenAddress: "0x0000000000000000000000000000000000000000",
    auctionType: "NFT", // Fixed field name from tokenType
    tokenId: "1",
    tokenAmount: "100",
  });

  const router = useRouter();
  const { status, address } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      (async () => {
        console.log("Transaction confirmed!");
        
        let auctionType: AuctionType;
        switch (formData.type) {
          case "all-pay":
            auctionType = "AllPay";
            break;
          case "english":
            auctionType = "English";
            break;
          case "dutch":
            // Map to specific Dutch auction type based on subtype
            if (formData.subtype === "exponential") {
              auctionType = "Exponential";
            } else if (formData.subtype === "logarithmic") {
              auctionType = "Logarithmic";
            } else {
              auctionType = "Linear";
            }
            break;
          case "vickrey":
            auctionType = "Vickrey";
            break;
          default:
            auctionType = "English";
        }

        const auctionService = getAuctionService(auctionType);
        const lastAuction = await auctionService.getLastNAuctions(1);
        const auctionId = lastAuction.length > 0 ? decode(lastAuction[0].id).id : "";
        if(lastAuction.length > 0 && lastAuction[0].auctioneer === address){
          append("CreatedAuctions",lastAuction[0].protocol,auctionId)
        }
        setIsSubmitted(true);
        setIsSubmitting(false);
        // Redirect after success
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      })();
    }
  }, [isConfirmed, router]);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!address || !writeContract) return;

    setIsSubmitting(true);
    try {
      // Map form auction type to our AuctionType
      let auctionType: AuctionType;
      switch (formData.type) {
        case "all-pay":
          auctionType = "AllPay";
          break;
        case "english":
          auctionType = "English";
          break;
        case "dutch":
          // Map to specific Dutch auction type based on subtype
          if (formData.subtype === "exponential") {
            auctionType = "Exponential";
          } else if (formData.subtype === "logarithmic") {
            auctionType = "Logarithmic";
          } else {
            auctionType = "Linear";
          }
          break;
        case "vickrey":
          auctionType = "Vickrey";
          break;
        default:
          auctionType = "English";
      }

      const auctionService = getAuctionService(auctionType);

      // Prepare auction parameters based on type
      const params = transformFormDataToParams(formData, auctionType);
      console.log("Submitting auction with params:", params);
      await auctionService.createAuction(writeContract, params);
      console.log("Transaction submitted, waiting for confirmation...");
    } catch (error) {
      console.error("Error creating auction:", error);
      setIsSubmitting(false);
    }
  };

  if (!status || status !== "connected") {
    return (
      <div className="container py-12 px-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full bg-card border rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-6">Connect Wallet</h1>
          <p className="text-muted-foreground mb-8">
            You need to connect your wallet to create an auction on HAH.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container py-12 px-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-card border rounded-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Auction Created!</h1>
          <p className="text-muted-foreground mb-6">
            Your auction has been created successfully and is now live on the
            platform!
          </p>
          <Button asChild>
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 mb-12 w-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Auction</h1>
          <p className="text-muted-foreground">
            Set up your auction parameters and publish it to the blockchain.
          </p>
        </div>

        <CreateAuctionSteps currentStep={currentStep} steps={steps} />

        <div className="bg-card border rounded-xl p-6 mt-8">
          <AuctionCreationForm
            currentStep={currentStep}
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
            handleFinalSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isPending={isPending}
            isConfirming={isConfirming}
          />
        </div>
      </div>
    </div>
  );
}
