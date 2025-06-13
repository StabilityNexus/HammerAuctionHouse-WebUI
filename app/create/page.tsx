"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuctionCreationForm } from "@/components/auction/create-form";
import { CreateAuctionSteps } from "@/components/auction/create-steps";
import {useAccount} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const steps = [
  "Basic Information",
  "Auction Settings",
  "Token Setup",
  "Review & Submit"
];

export default function CreateAuction() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    type: "english",
    startPrice: "0.1",
    reservePrice: "",
    duration: "3",
    minBidDelta: "0.05",
    decayFactor: "0.1",
    tokenAddress: "",
  });
  
  const router = useRouter();
  const { isConnected } = useAccount();
  
  const updateFormData = (data: Partial<typeof formData>) => {
    // Only update if the data has actually changed
    setFormData(prev => {
      const hasChanges = Object.entries(data).some(
        ([key, value]) => prev[key as keyof typeof prev] !== value
      );
      return hasChanges ? { ...prev, ...data } : prev;
    });
  };
  
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
  
  const handleSubmit = () => {
    setIsSubmitted(true);
    // Simulate creation delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };
  
  // If not connected, show connect prompt
  if (!isConnected) {
    return (
      <div className="container py-12 px-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full bg-card border rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-6">Connect Wallet</h1>
          <p className="text-muted-foreground mb-8">
            You need to connect your wallet to create an auction on HAH.
          </p>
          <ConnectButton/>
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
            Your auction has been created successfully and is now live on the platform.
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
          />
          
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={goToNextStep}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create Auction
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}