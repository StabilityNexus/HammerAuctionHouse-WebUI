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
import { HelpCircle, Upload } from "lucide-react";
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

interface AuctionCreationFormProps {
  currentStep: number;
  formData: any;
  updateFormData: (data: any) => void;
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
}: AuctionCreationFormProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Step 1: Basic Information
  const Step1Form = () => {
    const formSchema = z.object({
      title: z.string().min(5, "Title must be at least 5 characters").max(100),
      description: z.string().min(20, "Description must be at least 20 characters").max(500),
    });
    
    type FormValues = z.infer<typeof formSchema>;
    
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: formData.title || "",
        description: formData.description || "",
      },
    });
    
    const onSubmit = (data: FormValues) => {
      updateFormData({ 
        ...data, 
        imageUrl: selectedImage || formData.imageUrl || sampleImages[0],
      });
    };
    
    // Auto-save as user types with debounce
    React.useEffect(() => {
      const subscription = form.watch((value) => {
        const timer = setTimeout(() => {
          updateFormData(value);
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
      });
      return () => subscription.unsubscribe();
    }, [form, updateFormData]);
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auction Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title for your auction" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
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
          
          <div>
            <Label>Artwork Image</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select an image for your auction or choose from our samples
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {sampleImages.map((img, index) => (
                <div
                  key={index}
                  className={`aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 ${
                    selectedImage === img || (!selectedImage && formData.imageUrl === img)
                      ? "border-primary"
                      : "border-transparent hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`Sample ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
            
            <div className="text-center p-4 border border-dashed rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload custom image (not functional in demo)
              </p>
            </div>
          </div>
        </form>
      </Form>
    );
  };
  
  // Step 2: Auction Settings
  const Step2Form = () => {
    const formSchema = z.object({
      type: z.enum(["english", "dutch", "all-pay", "vickrey"]),
      startPrice: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Start price must be greater than 0",
      }),
      reservePrice: z.string().optional(),
      duration: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 1, {
        message: "Duration must be at least 1 day",
      }),
      minBidDelta: z.string().optional(),
      decayFactor: z.string().optional(),
    });
    
    type FormValues = z.infer<typeof formSchema>;
    
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        type: formData.type || "english",
        startPrice: formData.startPrice || "0.1",
        reservePrice: formData.reservePrice || "",
        duration: formData.duration || "3",
        minBidDelta: formData.minBidDelta || "0.05",
        decayFactor: formData.decayFactor || "0.1",
      },
    });
    
    const { watch } = form;
    const auctionType = watch("type");
    
    React.useEffect(() => {
      const subscription = watch((value) => {
        updateFormData(value);
      });
      return () => subscription.unsubscribe();
    }, [watch]);
    
    return (
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auction Type</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "english",
                      label: "English",
                      description: "Bids increase over time, highest bid wins when auction ends"
                    },
                    {
                      value: "dutch",
                      label: "Dutch",
                      description: "Price decreases over time until someone buys"
                    },
                    {
                      value: "all-pay",
                      label: "All-Pay",
                      description: "All bidders pay their bids, highest bid wins"
                    },
                    {
                      value: "vickrey",
                      label: "Vickrey",
                      description: "Sealed bids, highest bidder wins but pays second-highest price"
                    }
                  ].map(type => (
                    <Tooltip key={type.value}>
                      <TooltipTrigger asChild>
                        <div>
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              field.value === type.value
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => field.onChange(type.value)}
                          >
                            <div className="font-medium mb-1">{type.label}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{type.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
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
              control={form.control}
              name="reservePrice"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel>Reserve Price (ETH)</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Optional minimum price that must be met for the auction to be successful</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
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
          </div>
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (days)</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 3, 5, 7, 14, 30].map(days => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} {days === 1 ? "day" : "days"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {auctionType === "english" && (
            <FormField
              control={form.control}
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
                        <p className="max-w-xs">The minimum amount by which each new bid must exceed the current highest bid</p>
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
          )}
          
          {auctionType === "dutch" && (
            <FormField
              control={form.control}
              name="decayFactor"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel>Decay Factor</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">The rate at which the price decreases over time (e.g. 0.1 means 10% decay per day)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Input type="number" step="0.01" min="0.01" max="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
    );
  };
  
  // Step 3: Token Setup
  const Step3Form = () => {
    const formSchema = z.object({
      tokenAddress: z.string().optional(),
    });
    
    type FormValues = z.infer<typeof formSchema>;
    
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        tokenAddress: formData.tokenAddress || "",
      },
    });
    
    const { watch } = form;
    
    React.useEffect(() => {
      const subscription = watch((value) => {
        updateFormData(value);
      });
      return () => subscription.unsubscribe();
    }, [watch]);
    
    return (
      <Form {...form}>
        <form className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Token Settings (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              Configure which tokens are accepted for bidding on this auction.
              By default, auctions accept ETH.
            </p>
          </div>
          
          <FormField
            control={form.control}
            name="tokenAddress"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel>ERC20 Token Address (Optional)</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Enter a valid ERC20 token contract address to accept bids in that token</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input 
                    placeholder="0x..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground italic">
              Note: This is a demo, so token validation is not performed.
              In a real application, we would verify the token contract exists and is valid.
            </p>
          </div>
        </form>
      </Form>
    );
  };
  
  // Step 4: Review & Submit
  const Step4Form = () => {
    return (
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="aspect-square relative w-28 h-28 rounded-lg overflow-hidden bg-muted">
              <img
                src={formData.imageUrl || sampleImages[0]}
                alt="Auction preview"
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-semibold">{formData.title || "Untitled Auction"}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {formData.description || "No description provided."}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 bg-muted/20">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Auction Type</p>
              <p className="font-medium capitalize">{formData.type}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{formData.duration} days</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Start Price</p>
              <p className="font-medium">{formData.startPrice} ETH</p>
            </div>
            
            {formData.reservePrice && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Reserve Price</p>
                <p className="font-medium">{formData.reservePrice} ETH</p>
              </div>
            )}
            
            {formData.type === "english" && formData.minBidDelta && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Minimum Bid Increment</p>
                <p className="font-medium">{formData.minBidDelta} ETH</p>
              </div>
            )}
            
            {formData.type === "dutch" && formData.decayFactor && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Decay Factor</p>
                <p className="font-medium">{formData.decayFactor}</p>
              </div>
            )}
            
            {formData.tokenAddress && (
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">ERC20 Token Address</p>
                <p className="font-medium text-xs md:text-sm break-all">{formData.tokenAddress}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-500/10 text-blue-500 p-4 rounded-lg">
          <p className="text-sm">
            By creating this auction, you agree to our Terms of Service and Auction Rules.
            Once published, your auction will be visible to all HammerChain users.
          </p>
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