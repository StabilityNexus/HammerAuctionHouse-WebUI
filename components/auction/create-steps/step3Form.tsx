import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
interface Step3Form {
  currentStep: number;
  formData: any;
  goToPrevStep: () => void;
  goToNextStep: () => void;
  updateFormData: (data: any) => void;
}

export function Step3Form({
  formData,
  updateFormData,
  currentStep,
  goToPrevStep,
  goToNextStep,
}: Step3Form) {
  const formSchema = z
    .object({
      biddingTokenAddress: z
        .string()
        .min(1, "Bidding token address is required"),
      auctionType: z.enum(["NFT", "ERC20"]),
      auctionedTokenAddress: z
        .string()
        .min(1, "Auctioned token address is required"),
      tokenId: z.string().optional(),
      tokenAmount: z.string().optional(),
    })
    .refine(
      (data) =>
        (data.auctionType === "NFT" &&
          data.tokenId &&
          data.tokenId.length > 0) ||
        (data.auctionType === "ERC20" &&
          data.tokenAmount &&
          data.tokenAmount.length > 0),
      {
        message:
          "Token ID is required for NFT, Token Amount is required for ERC20",
        path: ["auctionType"],
      }
    );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      biddingTokenAddress: formData.biddingTokenAddress || "",
      auctionType: formData.auctionType || "NFT",
      auctionedTokenAddress: formData.auctionedTokenAddress || "",
      tokenId: formData.tokenId || "",
      tokenAmount: formData.tokenAmount || "",
    },
  });

  const { watch, setValue } = form;
  const auctionType = watch("auctionType");

  const onSubmit_3 = (data: FormValues) => {
    updateFormData(data);
    goToNextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit_3)} className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Token Setup</h3>
          <p className="text-sm text-muted-foreground">
            Specify the ERC20 token to be used for bidding, the auction type,
            and the token being auctioned (NFT or ERC20).
          </p>
        </div>
        <FormField
          control={form.control}
          name="biddingTokenAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bidding Token Address (ERC20)</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="auctionType"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-4 mb-2">
                <FormLabel className="mb-0">Auctioned Token Type</FormLabel>
                <div className="flex border rounded-sm overflow-hidden">
                  <button
                    type="button"
                    className={`px-4 py-1 text-sm font-medium transition-colors ${
                      field.value === "NFT"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                    onClick={() => setValue("auctionType", "NFT")}
                  >
                    NFT
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-1 text-sm font-medium transition-colors ${
                      field.value === "ERC20"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                    onClick={() => setValue("auctionType", "ERC20")}
                  >
                    ERC20
                  </button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="auctionedTokenAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {auctionType === "NFT"
                  ? "NFT Contract Address"
                  : "ERC20 Token Address"}
              </FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {auctionType === "NFT" && (
          <FormField
            control={form.control}
            name="tokenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NFT Token ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter NFT Token ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {auctionType === "ERC20" && (
          <FormField
            control={form.control}
            name="tokenAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ERC20 Token Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter amount to auction"
                    type="number"
                    min="0"
                    step="any"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
          <Button type="submit">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
