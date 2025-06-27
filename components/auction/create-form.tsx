import React from "react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle, Upload, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DecayPreviewChart } from "@/components/auction/decay-preview-chart";
import { clear } from "console";
import { title } from "process";

interface AuctionCreationFormProps {
  currentStep: number;
  formData: any;
  updateFormData: (data: any) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  handleFinalSubmit: () => void;
  isSubmitting?: boolean;
  totalSteps: number;
}

// Sample images for demo
const sampleImages = [
  "https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3573555/pexels-photo-3573555.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2419375/pexels-photo-2419375.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export function AuctionCreationForm({
  currentStep,
  formData,
  updateFormData,
  goToNextStep,
  goToPrevStep,
  handleFinalSubmit,
  isSubmitting = false,
  totalSteps,
}: AuctionCreationFormProps) {
  // Step 1: Basic Information
  const formSchema_1 = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(500),
    imageUrl: z.string().url("Must be a valid URL").optional(),
  });

  type FormValues_1 = z.infer<typeof formSchema_1>;

  const form_1 = useForm<FormValues_1>({
    resolver: zodResolver(formSchema_1),
    defaultValues: {
      title: formData.title || "",
      description: formData.description || "",
      imageUrl: formData.imageUrl || "",
    },
  });
  const onSubmit = (data: FormValues_1) => {
    updateFormData({
      ...data,
    });
    goToNextStep();
  };
  const Step1Form = () => {
    return (
      <Form {...form_1}>
        <form onSubmit={form_1.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form_1.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auction Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a title for your auction"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form_1.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what you're auctioning"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form_1.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artwork Image</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          
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
            
            <Button type="submit">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  // Utility to convert days/hours/minutes to seconds
  function getDurationSeconds(days: string, hours: string, minutes: string) {
    const d = parseInt(days) || 0;
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    return d * 86400 + h * 3600 + m * 60;
  }

  // Step 2: Auction Settings - Moved outside component for performance
  // Common fields for all auction types
  const durationFields = {
    days: z.string().optional(),
    hours: z.string().optional(),
    minutes: z.string().optional(),
  };

  // Form schemas for auction types
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
      decayFactor: z.string().optional(), // Only required for exp/log
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

  const vickreySchema = z
    .object({
      type: z.literal("vickrey"),
      commitDays: z.string().optional(),
      commitHours: z.string().optional(),
      commitMinutes: z.string().optional(),
      revealDays: z.string().optional(),
      revealHours: z.string().optional(),
      revealMinutes: z.string().optional(),
    })
    .refine(
      (data) => {
        const revealSeconds = getDurationSeconds(
          data.revealDays || "",
          data.revealHours || "",
          data.revealMinutes || ""
        );
        return revealSeconds >= 86400;
      },
      {
        message: "Reveal period must be at least 1 day",
        path: ["revealDays"],
      }
    );

  // Select schema based on type - recalculate when formData changes
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

  // Default values for each type - recalculate when formData changes
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

  // Step 2 form state moved outside component
  const form_2 = useForm<FormValues>({
    resolver: zodResolver(formSchema as any), // Use any to allow dynamic schema switching
    defaultValues,
  });

  // Reset form when relevant dependencies change
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

  const onSubmit_2 = (data: FormValues) => {
    let update: any = { ...data };
    if (data.type === "vickrey") {
      update.commitDuration = getDurationSeconds(
        data.commitDays || "0",
        data.commitHours || "0",
        data.commitMinutes || "0"
      );
      update.revealDuration = getDurationSeconds(
        data.revealDays || "0",
        data.revealHours || "0",
        data.revealMinutes || "0"
      );
    } else {
      update.duration = getDurationSeconds(
        data.days || "0",
        data.hours || "0",
        data.minutes || "0"
      );
    }
    
    console.log("Step 2 form submission data:", update);
    
    // Always update formData and proceed to next step if validation passes
    updateFormData(update);
    goToNextStep();
  };

  const Step2Form = () => {
    // Get current values from formData for conditional rendering (no reactive updates)
    const auctionType = formData.type || "english";
    const dutchSubtype = formData.subtype || "linear";
    console.log("Current auction type:", auctionType);
    console.log("Dutch subtype:", dutchSubtype);
    // Dutch auction specific fields for chart - using formData instead of watch
    const dutchStartPrice = formData.startPrice || "0";
    const dutchReservePrice = formData.reservePrice || "0";
    const dutchDecayFactor = formData.decayFactor || "0";
    const dutchDuration = getDurationSeconds(
      formData.days || "0",
      formData.hours || "0",
      formData.minutes || "0"
    );

    return (
      <Form {...form_2}>
        <form onSubmit={form_2.handleSubmit(onSubmit_2)} className="space-y-6">
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
                  duration={dutchDuration}
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
                form_2.handleSubmit(onSubmit_2)();
              }}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  // Step 3: Token Setup
  const Step3Form = () => {
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

          {/* Auctioned Token Type Toggle */}
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

          {/* NFT: Token ID, ERC20: Token Amount */}
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
            
            <Button type="submit">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  // Step 4: Review & Submit
  const Step4Form = () => {
    // Helper for duration formatting
    function formatDuration(seconds?: number) {
      if (!seconds || isNaN(seconds)) return "-";
      const d = Math.floor(seconds / 86400);
      const h = Math.floor((seconds % 86400) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return (
        [
          d > 0 ? `${d}days ` : null,
          h > 0 ? `${h}hours ` : null,
          m > 0 ? `${m}minutes` : null,
        ]
          .filter(Boolean)
          .join(" ") || "0m"
      );
    }

    // Auction settings
    const auctionType = formData.type;
    const tokenType = formData.auctionType;

    // Duration
    let durationLabel = "-";
    if (auctionType === "vickrey") {
      durationLabel = `Commit: ${formatDuration(
        formData.commitDuration
      )} | Reveal: ${formatDuration(formData.revealDuration)}`;
    } else {
      durationLabel = formatDuration(formData.duration);
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
                {/* {formData.reservePrice && (
                  <>
                    <div className="text-muted-foreground">Reserve Price</div>
                    <div className="font-medium">
                      {formData.reservePrice} ETH
                    </div>
                  </>
                )} */}
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
                    <div className="font-medium">
                      {formData.reservePrice} ETH
                    </div>
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

            {/* Token Setup */}
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
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? "Creating..." : "Create Auction"}
          </Button>
        </div>
      </div>
    );
  };

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
          {currentStep === 0 && <Step1Form />}
          {currentStep === 1 && <Step2Form />}
          {currentStep === 2 && <Step3Form />}
          {currentStep === 3 && <Step4Form />}
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
}
