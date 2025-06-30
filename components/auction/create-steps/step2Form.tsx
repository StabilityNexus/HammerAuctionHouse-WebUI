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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getDurationInSeconds } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DecayPreviewChart } from "../decay-preview-chart";

interface Step2Form {
  currentStep: number;
  formData: any;
  goToPrevStep: () => void;
  goToNextStep: () => void;
  updateFormData: (data: any) => void;
}

/**
 * Renders the second step of the auction creation form, allowing users to configure auction parameters for multiple auction types.
 *
 * Displays dynamic form fields and validation based on the selected auction type (English, All-Pay, Dutch with subtypes, or Vickrey). Handles form state, validation, and synchronization with parent data. On submission, converts duration fields to seconds and updates the parent form data before proceeding to the next step.
 *
 * @param formData - The current form data for the auction configuration step
 * @param updateFormData - Callback to update the parent form data with new values
 * @param currentStep - The current step index in the multi-step form
 * @param goToPrevStep - Callback to navigate to the previous step
 * @param goToNextStep - Callback to navigate to the next step
 * @returns The rendered auction configuration form for step 2
 */
export function Step2Form({
  formData,
  updateFormData,
  currentStep,
  goToPrevStep,
  goToNextStep,
}: Step2Form) {
  const durationFields = {
    days: z.string().optional(),
    hours: z.string().optional(),
    minutes: z.string().optional(),
  };

  const englishAllPaySchema = z.object({
    type: z.enum(["english", "all-pay"]),
    startPrice: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Starting price must be greater than 0",
      }),
    minBidDelta: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: "Minimum bid increment must be 0 or more tokens",
      }),
    deadlineExtension: z
      .string()
      .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
        message: "Deadline extension must be 0 or more seconds",
      }),
    ...durationFields,
  });

  const dutchSchema = z
    .object({
      type: z.literal("dutch"),
      subtype: z.enum(["linear", "exponential", "logarithmic"]),
      startPrice: z
        .string()
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
          message: "Start price must be greater than 0",
        }),
      reservePrice: z.string().optional(),
      decayFactor: z.string().optional(),
      ...durationFields,
    })
    .refine(
      (data) =>
        data.subtype === "linear" ||
        ((data.subtype === "exponential" || data.subtype === "logarithmic") &&
          data.decayFactor &&
          parseFloat(data.decayFactor) > 0),
      {
        message: "Decay factor required for exponential/logarithmic",
        path: ["decayFactor"],
      }
    );

  const vickreySchema = z.object({
    type: z.literal("vickrey"),
    commitDays: z.string().optional(),
    commitHours: z.string().optional(),
    commitMinutes: z.string().optional(),
    revealDays: z.string().optional(),
    revealHours: z.string().optional(),
    revealMinutes: z.string().optional(),
  });
  // .refine(
  //   (data) => {
  //     const revealSeconds = getDurationSeconds(
  //       data.revealDays || "",
  //       data.revealHours || "",
  //       data.revealMinutes || ""
  //     );
  //     return revealSeconds >= 86400;
  //   },
  //   {
  //     message: "Reveal period must be at least 1 day",
  //     path: ["revealDays"],
  //   }
  // );

  const formSchema = React.useMemo(() => {
    switch (formData.type) {
      case "english":
      case "all-pay":
        return englishAllPaySchema;
      case "dutch":
        return dutchSchema;
      case "vickrey":
        return vickreySchema;
      default:
        return englishAllPaySchema;
    }
  }, [formData.type]);

  type FormValues = {
    type: "english" | "all-pay" | "dutch" | "vickrey";
    subtype?: "linear" | "exponential" | "logarithmic";
    startPrice?: string;
    minBidDelta?: string;
    deadlineExtension?: string;
    reservePrice?: string;
    decayFactor?: string;
    days?: string;
    hours?: string;
    minutes?: string;
    commitDays?: string;
    commitHours?: string;
    commitMinutes?: string;
    revealDays?: string;
    revealHours?: string;
    revealMinutes?: string;
  };

  // Auction type selection tab
  const auctionTypes = [
    {
      value: "english",
      label: "English Auction",
      description:
        "Bids increase over time, highest bid wins when auction ends.",
    },
    {
      value: "all-pay",
      label: "All-Pay Auction",
      description: "All bidders pay their bids, highest bid wins.",
    },
    {
      value: "dutch",
      label: "Reverse Dutch Auction",
      description:
        "Price decreases over time until someone buys. Supports linear, exponential, logarithmic.",
    },
    {
      value: "vickrey",
      label: "Vickrey Auction",
      description:
        "Sealed bids, highest bidder wins but pays second-highest price.",
    },
  ];

  const defaultValues: any = React.useMemo(() => {
    if (formData.type === "dutch") {
      return {
        type: "dutch",
        subtype: formData.subtype || "linear",
        startPrice: formData.startPrice || "0.1",
        reservePrice: formData.reservePrice || "0",
        decayFactor: formData.decayFactor || "",
        days: formData.days || "3",
        hours: formData.hours || "0",
        minutes: formData.minutes || "0",
      };
    }
    if (formData.type === "vickrey") {
      return {
        type: "vickrey",
        commitDays: formData.commitDays || "1",
        commitHours: formData.commitHours || "0",
        commitMinutes: formData.commitMinutes || "0",
        revealDays: formData.revealDays || "2",
        revealHours: formData.revealHours || "0",
        revealMinutes: formData.revealMinutes || "0",
      };
    }
    // english/all-pay
    return {
      type: formData.type || "english",
      startPrice: formData.startPrice || "0.1",
      minBidDelta: formData.minBidDelta || "0.05",
      deadlineExtension: formData.deadlineExtension || "60",
      days: formData.days || "3",
      hours: formData.hours || "0",
      minutes: formData.minutes || "0",
    };
  }, [formData]);

  const form_2 = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues,
  });

  React.useEffect(() => {
    // Reset form when type changes or when schema/defaults change
    form_2.reset(defaultValues);
  }, [formData.type, formData.subtype, defaultValues, formSchema]);

  // Watch only auction type changes to trigger form updates
  React.useEffect(() => {
    const subscription = form_2.watch((value, { name }) => {
      if (name === "type" && value.type !== formData.type) {
        // Only update formData when auction type changes
        updateFormData({ ...formData, type: value.type });
      }
    });
    return () => subscription.unsubscribe();
  }, [form_2, formData, updateFormData]);

  const onSubmit = (data: FormValues) => {
    let update: any = { ...data };
    if (data.type === "vickrey") {
      update.commitDuration = getDurationInSeconds(
        data.commitDays || "0",
        data.commitHours || "0",
        data.commitMinutes || "0"
      );
      update.revealDuration = getDurationInSeconds(
        data.revealDays || "0",
        data.revealHours || "0",
        data.revealMinutes || "0"
      );
    } else {
      update.duration = getDurationInSeconds(
        data.days || "0",
        data.hours || "0",
        data.minutes || "0"
      );
    }
    console.log("Step 2 form submission data:", update);
    updateFormData(update);
    goToNextStep();
  };

  const auctionType = formData.type || "english";
  
  const watchedValues = form_2.watch();
  const dutchSubtype = watchedValues.subtype || formData.subtype || "linear";
  console.log("Current auction type:", auctionType);
  console.log("Dutch subtype:", dutchSubtype);
  const dutchStartPrice = watchedValues.startPrice || formData.startPrice || "0";
  const dutchReservePrice = watchedValues.reservePrice || formData.reservePrice || "0";
  const dutchDecayFactor = watchedValues.decayFactor || formData.decayFactor || "0";
  const dutchDuration = getDurationInSeconds(
    watchedValues.days || formData.days || "0",
    watchedValues.hours || formData.hours || "0",
    watchedValues.minutes || formData.minutes || "0"
  );

  return (
      <Form {...form_2}>
        <form onSubmit={form_2.handleSubmit(onSubmit)} className="space-y-6">
          {/* Auction Type Tabs */}
          <div className="mb-6">
            <Label className="mb-2 block">Auction Type</Label>
            <div className="flex flex-wrap gap-3">
              {auctionTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`border rounded-lg p-4 flex-1 min-w-[180px] text-left transition-all ${
                    auctionType === type.value
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => {
                    form_2.setValue("type", type.value as "english" | "all-pay" | "dutch" | "vickrey");
                    
                    // Immediately update formData with the new auction type
                    const currentFormData = form_2.getValues();
                    const update = { 
                      ...currentFormData, 
                      type: type.value as "english" | "all-pay" | "dutch" | "vickrey"
                    };
                    updateFormData(update);
                  }}
                >
                  <div className="font-medium mb-1">{type.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* English/All-Pay */}
          {(auctionType === "english" || auctionType === "all-pay") && (
            <>
              <FormField
                control={form_2.control}
                name="startPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Price (ETH)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form_2.control}
                name="minBidDelta"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Minimum Bid Increment (ETH)</FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            The minimum amount by which each new bid must exceed
                            the current highest bid.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <FormControl>
                      <Input type="number" step="0.01" min="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form_2.control}
                name="deadlineExtension"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Deadline Extension (seconds)</FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Time (in seconds) by which the auction deadline
                            extends when a new bid is placed near the end.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <FormControl>
                      <Input type="number" step="1" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Duration fields with label */}
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label>Duration</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Total auction duration. You can set days, hours, and
                        minutes.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-2">
                  <FormField
                    control={form_2.control}
                    name="days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form_2.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="23" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form_2.control}
                    name="minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minutes</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="59" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {/* Reverse Dutch */}
          {auctionType === "dutch" && (
            <>
              <FormField
                control={form_2.control}
                name="subtype"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reverse Dutch Subtype</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => {
                        field.onChange(value as "linear" | "exponential" | "logarithmic");
                        form_2.setValue("subtype", value as "linear" | "exponential" | "logarithmic");
                        
                        // Immediately update formData with the new subtype
                        const currentFormData = form_2.getValues();
                        const update = { 
                          ...currentFormData, 
                          subtype: value as "linear" | "exponential" | "logarithmic"
                        };
                        updateFormData(update);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subtype" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="exponential">Exponential</SelectItem>
                        <SelectItem value="logarithmic">Logarithmic</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form_2.control}
                name="startPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Price (ETH)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form_2.control}
                name="reservePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reserve Price (ETH)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Optional"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(dutchSubtype === "exponential" ||
                dutchSubtype === "logarithmic") && (
                <FormField
                  control={form_2.control}
                  name="decayFactor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decay Factor</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* Duration fields with label */}
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label>Duration</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Total auction duration. You can set days, hours, and
                        minutes.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-2">
                  <FormField
                    control={form_2.control}
                    name="days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form_2.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="23" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form_2.control}
                    name="minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minutes</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="59" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Decay Preview Chart */}
              <div className="pt-6">
                <DecayPreviewChart
                  startPrice={parseFloat(dutchStartPrice || "0")}
                  reservedPrice={parseFloat(dutchReservePrice || "0")}
                  duration={Number(dutchDuration)}
                  decayFactor={parseFloat(dutchDecayFactor || "0")}
                  decayType={dutchSubtype || "linear"}
                />
              </div>
            </>
          )}

          {/* Vickrey */}
          {auctionType === "vickrey" && (
            <>
              <div className="flex items-center gap-1 font-semibold mb-2">
                Commit Period
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Duration in which bidders can commit their sealed bids.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2 mb-4">
                <FormField
                  control={form_2.control}
                  name="commitDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form_2.control}
                  name="commitHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="23" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form_2.control}
                  name="commitMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minutes</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="59" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-1 font-semibold mb-2">
                Reveal Period
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Duration when all committed bidders are expected to reveal
                      their bids. Must be at least 1 day.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form_2.control}
                  name="revealDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form_2.control}
                  name="revealHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="23" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form_2.control}
                  name="revealMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minutes</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="59" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage />
            </>
          )}
          
          {/* Navigation Buttons */}
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
              type="submit"
              onClick={() => {
                // Force validation before submission
                form_2.handleSubmit(onSubmit)();
              }}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    );
}
