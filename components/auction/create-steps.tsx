import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateAuctionStepsProps {
  currentStep: number;
  steps: string[];
}

export function CreateAuctionSteps({ currentStep, steps }: CreateAuctionStepsProps) {
  return (
    <div className="relative">
      <div className="absolute top-4 left-5 right-5 h-0.5 bg-border">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <ol className="relative grid grid-cols-4 w-full">
        {steps.map((step, index) => (
          <li key={index} className="relative">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors duration-200 z-10",
                  index === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground bg-background text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "absolute top-10 text-xs font-medium text-center w-full px-1",
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}