import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Step1Form } from "./create-steps/step1Form";
import { Step2Form } from "./create-steps/step2Form";
import { Step3Form } from "./create-steps/step3Form";
import { Step4Form } from "./create-steps/step4Form";
interface AuctionCreationFormProps {
  currentStep: number;
  formData: any;
  updateFormData: (data: any) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  handleFinalSubmit: () => void;
  isSubmitting?: boolean;
  isPending?: boolean;
  isConfirming?: boolean;
}

export function AuctionCreationForm({
  currentStep,
  formData,
  updateFormData,
  goToNextStep,
  goToPrevStep,
  handleFinalSubmit,
  isSubmitting = false,
  isPending = false,
  isConfirming = false,
}: AuctionCreationFormProps) {
  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 0 && (
            <Step1Form
              formData={formData}
              updateFormData={updateFormData}
              currentStep={currentStep}
              goToPrevStep={goToPrevStep}
              goToNextStep={goToNextStep}
            />
          )}
          {currentStep === 1 && (
            <Step2Form
              formData={formData}
              updateFormData={updateFormData}
              currentStep={currentStep}
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
            />
          )}
          {currentStep === 2 && (
            <Step3Form
              formData={formData}
              updateFormData={updateFormData}
              currentStep={currentStep}
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
            />
          )}
          {currentStep === 3 && (
            <Step4Form
              formData={formData}
              updateFormData={updateFormData}
              currentStep={currentStep}
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
              handleFinalSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
              isPending={isPending}
              isConfirming={isConfirming}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
}
