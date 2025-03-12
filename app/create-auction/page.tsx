"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ethers } from "ethers"
import { motion } from "framer-motion"
import {
  AlertCircle,
  Check,
  Clock,
  DollarSign,
  Gavel,
  HelpCircle,
  Info,
} from "lucide-react"
import { FormEvent, useState } from "react"
import { useAppContext } from "../context/AppContextProvider"

export default function CreateAuction() {
  const {
    account,
    setAccount,
    connected,
    setConnected,
    signer,
    setSigner,
    auctionClient,
  } = useAppContext()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tokenAddress: "",
    tokenAmountOrId: "",
    startingBid: "",
    minBidDelta: "",
    deadlineExtension: "",
    imageUrl: "",
    duration: "24",
    auctionType: "0",
  })
  // Asset types that can be auctioned
  const auctionType = [
    { value: "0", label: "NFT", description: "Non-Fungible Token (ERC-721)" },
    { value: "1", label: "ERC-20", description: "Fungible Token" },
  ]
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Form validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Auction name is required"
    if (!formData.tokenAddress.trim())
      newErrors.tokenAddress = "Token address is required"
    if (formData.auctionType !== "1" && !formData.tokenAmountOrId.trim())
      newErrors.tokenAmountOrId = "Token ID is required"
    if (formData.auctionType === "1" && !formData.tokenAmountOrId.trim())
      newErrors.tokenAmountOrId = "Token amount is required"
    if (!formData.startingBid.trim())
      newErrors.startingBid = "Starting bid is required"
    else if (Number.parseFloat(formData.startingBid) < 0)
      newErrors.startingBid = "Starting bid must be greater than or equal to 0"

    if (!formData.minBidDelta.trim())
      newErrors.minBidDelta = "Minimum bid delta is required"
    else if (Number.parseFloat(formData.minBidDelta) < 0)
      newErrors.minBidDelta =
        "Minimum bid delta must be greater than or equal to 0"

    if (Number.parseInt(formData.deadlineExtension) < 0)
      newErrors.deadlineExtension = "Deadline extension must be 0 or greater"

    if (Number.parseInt(formData.duration) <= 0) {
      newErrors.customDuration = "Duration must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [successMessage, setSuccessMessage] = useState<string>("")

  const handleCreateAuction = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!validateForm()) return
    try {
      if (!auctionClient) {
        throw new Error("Please connect your wallet first")
      }

      // Convert values based on auction type
      const tokenIdOrAmount =
        formData.auctionType === "0"
          ? BigInt(formData.tokenAmountOrId) // For NFTs, use the ID directly
          : ethers.parseEther(formData.tokenAmountOrId) // For ERC20, parse as ether

      const result = await auctionClient.createAuction(
        formData.name,
        formData.description,
        formData.imageUrl,
        Number(formData.auctionType),
        formData.tokenAddress,
        tokenIdOrAmount,
        ethers.parseEther(formData.startingBid),
        ethers.parseEther(formData.minBidDelta),
        BigInt(formData.deadlineExtension),
        BigInt(formData.duration)
      )
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
      console.log("Auction created", result)
    } catch (error) {
      console.error("Error creating auction:", error)
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to create auction. Please try again.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 pt-24 flex items-center justify-center">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900 border-gray-800 text-white overflow-hidden">
            <CardHeader className="border-b border-gray-800 bg-gray-900/50">
              <div className="flex items-center gap-3">
                <Gavel className="h-6 w-6 text-purple-400" />
                <div>
                  <CardTitle className="text-xl font-bold">
                    Create All-Pay Auction
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Create a new All-Pay auction where all bidders pay their bid
                    amount, but only the highest bidder wins.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleCreateAuction}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-gray-800 rounded-sm px-6 ">
                  <TabsTrigger
                    value="basic"
                    className="data-[state=active]:bg-gray-700"
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-gray-700"
                  >
                    Auction Settings
                  </TabsTrigger>
                </TabsList>

                <CardContent className="p-6">
                  <TabsContent value="basic" className="space-y-6 mt-0">
                    {/* Auction Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">
                        Auction Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter a name for your auction"
                        value={formData.name}
                        onChange={handleChange}
                        className={`bg-gray-800 border-gray-700 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Asset Type Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="auctionType" className="text-gray-300">
                        Asset Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.auctionType}
                        onValueChange={(value) =>
                          handleSelectChange("auctionType", value)
                        }
                      >
                        <SelectTrigger
                          id="auctionType"
                          className="bg-gray-800 border-gray-700"
                        >
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {auctionType.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              className="text-white"
                            >
                              <div className="flex flex-col items-start">
                                <div>{type.label}</div>
                                <div className="text-gray-400 text-xs">
                                  {type.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Token Address */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="tokenAddress" className="text-gray-300">
                          Token Address <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full p-0"
                              >
                                <HelpCircle className="h-3 w-3 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700">
                              <p className="text-sm">
                                The contract address of the token you want to
                                auction.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="tokenAddress"
                        name="tokenAddress"
                        placeholder="0x..."
                        value={formData.tokenAddress}
                        onChange={handleChange}
                        className={`bg-gray-800 border-gray-700 font-mono ${
                          errors.tokenAddress ? "border-red-500" : ""
                        }`}
                      />
                      {errors.tokenAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.tokenAddress}
                        </p>
                      )}
                    </div>

                    {/* Token ID Or Amount */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="tokenAmountOrId"
                          className="text-gray-300"
                        >
                          {formData.auctionType == "0"
                            ? "Token ID"
                            : "Token Amount"}
                          <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full p-0"
                              >
                                <HelpCircle className="h-3 w-3 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700">
                              <p className="text-sm">
                                {formData.auctionType == "0"
                                  ? "The unique identifier of your NFT."
                                  : "Amount of token to be auctioned"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="tokenAmountOrId"
                        name="tokenAmountOrId"
                        placeholder={
                          formData.auctionType == "0"
                            ? "The token ID"
                            : "Enter amount of token"
                        }
                        value={formData.tokenAmountOrId}
                        onChange={handleChange}
                        className={`bg-gray-800 border-gray-700 ${
                          errors.tokenAmountOrId ? "border-red-500" : ""
                        }`}
                      />
                      {errors.tokenAmountOrId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.tokenAmountOrId}
                        </p>
                      )}
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="text-gray-300">
                        Image URL
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="imageUrl"
                          name="imageUrl"
                          placeholder="https://..."
                          value={formData.imageUrl}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 flex-1"
                        />
                      </div>
                      <p className="text-gray-500 text-sm">
                        Provide an image URL for your auction item. If not
                        provided, the token's metadata will be used if
                        available.
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-300">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your auction item..."
                        value={formData.description}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 min-h-[100px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6 mt-0">
                    {/* Starting Bid */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="startingBid" className="text-gray-300">
                          Starting Bid (ETH){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full p-0"
                              >
                                <HelpCircle className="h-3 w-3 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700">
                              <p className="text-sm">
                                The minimum amount for the first bid.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="startingBid"
                          name="startingBid"
                          type="number"
                          step="0.0001"
                          placeholder="0.01"
                          value={formData.startingBid}
                          onChange={handleChange}
                          className={`bg-gray-800 border-gray-700 pl-10 ${
                            errors.startingBid ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.startingBid && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.startingBid}
                        </p>
                      )}
                    </div>

                    {/* Minimum Bid Delta */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="minBidDelta" className="text-gray-300">
                          Minimum Bid Increment (ETH){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full p-0"
                              >
                                <HelpCircle className="h-3 w-3 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700">
                              <p className="text-sm">
                                The minimum amount a new bid must be higher than
                                the current highest bid.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="minBidDelta"
                          name="minBidDelta"
                          type="number"
                          step="0.0001"
                          placeholder="0.001"
                          value={formData.minBidDelta}
                          onChange={handleChange}
                          className={`bg-gray-800 border-gray-700 pl-10 ${
                            errors.minBidDelta ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.minBidDelta && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.minBidDelta}
                        </p>
                      )}
                    </div>

                    {/* Auction Duration */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="duration" className="text-gray-300">
                          Auction Duration{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                      </div>

                      <div className="mt-2">
                        <div className="flex gap-3 items-center">
                          <Input
                            id="duration"
                            name="duration"
                            type="number"
                            min="1"
                            placeholder="Enter in seconds"
                            value={formData.duration}
                            onChange={handleChange}
                            className={`bg-gray-800 border-gray-700 ${
                              errors.duration ? "border-red-500" : ""
                            }`}
                          />
                          <span className="text-gray-400">sec</span>
                        </div>
                        {errors.customDuration && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.customDuration}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Deadline Extension */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="deadlineExtension"
                          className="text-gray-300"
                        >
                          Deadline Extension (seconds){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full p-0"
                              >
                                <HelpCircle className="h-3 w-3 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700 max-w-xs">
                              <p className="text-sm">
                                Time added to the auction when a bid is placed
                                near the end. Set to 0 for no extension.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="deadlineExtension"
                          name="deadlineExtension"
                          type="number"
                          min="0"
                          placeholder="300"
                          value={formData.deadlineExtension}
                          onChange={handleChange}
                          className={`bg-gray-800 border-gray-700 pl-10 ${
                            errors.deadlineExtension ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.deadlineExtension && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.deadlineExtension}
                        </p>
                      )}
                      <p className="text-gray-500 text-sm">
                        Recommended: 300 seconds (5 minutes). This prevents
                        sniping at the last second.
                      </p>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>

              <CardFooter className="flex flex-col space-y-4 bg-gray-900/50 border-t border-gray-800 p-6">
                {/* Summary */}
                <div className="w-full p-4 bg-gray-800 rounded-lg space-y-2">
                  <h3 className="text-sm font-medium text-gray-300">
                    Auction Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Type:</div>
                    <div className="font-medium">All-Pay Auction</div>

                    <div className="text-gray-400">Asset Type:</div>
                    <div className="font-medium">
                      {auctionType.find((t) => t.value === formData.auctionType)
                        ?.label || "NFT"}
                    </div>

                    <div className="text-gray-400">Starting Bid:</div>
                    <div className="font-medium">
                      {formData.startingBid
                        ? `${formData.startingBid} ETH`
                        : "-"}
                    </div>

                    <div className="text-gray-400">Duration:</div>
                    <div className="font-medium">{formData.duration}</div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    <Info className="inline-block h-3 w-3 mr-1" />
                    In All-Pay Auctions, all bidders pay their bid amount, but
                    only the highest bidder wins.
                  </div>
                </div>

                {/* Error message if submission failed */}
                {errors.submit && (
                  <Alert
                    variant="destructive"
                    className="bg-red-900/20 border-red-800"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                {/* Success message */}
                {showSuccess && (
                  <Alert className="bg-green-900/20 border-green-500">
                    <Check className="h-4 w-4 text-green-400" />
                    <AlertTitle className="text-green-400">Success</AlertTitle>
                    <AlertDescription className="text-green-400">
                      Your auction has been created successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action buttons */}
                <div className="flex justify-between w-full">
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Creating Auction...</>
                    ) : (
                      <>Create Auction</>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
