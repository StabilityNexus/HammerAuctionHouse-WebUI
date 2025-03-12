"use client"
import { useAppContext } from "@/app/context/AppContextProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Auction } from "@/lib/types"
import { cn, formatTimeLeft, handleError } from "@/lib/utils"
import { ethers } from "ethers"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronUp, Gavel, LinkIcon, User } from "lucide-react"
import { useParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"

interface AuctionDetailProps {
  auction: Auction
  signer: ethers.Signer
}

interface Bid {
  bidder: string
  amount: string
  timestamp: number
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success("Address copied to clipboard!")
  } catch (err) {
    console.error("Failed to copy:", err)
    toast.error("Failed to copy address")
  }
}

export default function AuctionDetail() {
  const { id } = useParams()
  const [bidAmount, setBidAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [bids, setBids] = useState<Bid[]>([])
  const [isEnded, setIsEnded] = useState<boolean>(false)
  const { account, auctionClient } = useAppContext()
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false)
  const [auction, setAuction] = useState<Auction>({
    id: "",
    name: "",
    description: "",
    imageUrl: "",
    auctionType: 0,
    auctioneer: "",
    tokenAddress: "",
    tokenIdOrAmount: "",
    startingBid: "0",
    highestBid: "0",
    highestBidder: "0",
    deadline: "",
    minBidDelta: "0",
    deadlineExtension: "",
    totalBids: "",
    availableFunds: "",
  })
  const [loading, setLoading] = useState(true)

  const fetchAuction = async () => {
    try {
      setLoading(true)
      if (!auctionClient) {
        throw new Error("Auction client not initialized")
      }
      console.log(id)
      if (!id || Array.isArray(id)) {
        throw new Error("Invalid auction ID")
      }
      const auction = await auctionClient.getAuction(parseInt(id))
      console.log(auction)
      setAuction(auction)
      const fetchedBids = await auctionClient.getAuctionBids(
        parseInt(auction.id)
      )
      setBids(fetchedBids)
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Failed to fetch bids")
    } finally {
      setLoading(false)
    }
  }

  const checkStatus = async () => {
    if (!auctionClient) return
    setIsEnded(await auctionClient.isEnded(parseInt(auction.id)))
  }

  useEffect(() => {
    if (auctionClient) {
      fetchAuction()
      checkStatus()

      // Update time remaining every second
      const timer = setInterval(() => {
        const deadline = Number(auction.deadline) * 1000
        if (deadline - Date.now() > 0) {
          setTimeRemaining(formatTimeLeft(new Date(deadline)))
        } else {
          setTimeRemaining("Auction Ended")
          setIsEnded(true)
          clearInterval(timer)
        }
      }, 1000)

      // Cleanup interval on unmount
      return () => clearInterval(timer)
    }
  }, [auction.id, auction.deadline, auctionClient]) // Added auctionClient as dependency

  const handlePlaceBid = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const bidAmountInWei = ethers.parseEther(bidAmount)
      console.log(
        `Placing bid of ${bidAmountInWei} wei on auction ${auction.id}`
      )
      await auctionClient.placeBid(parseInt(auction.id), bidAmountInWei)
      setBidAmount("")
      await Promise.all([fetchAuction(), checkStatus()])
      setSuccessMessage("Bid placed succesfully!")
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (err) {
      console.log("Error placing bid:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawFunds = async () => {
    setIsSubmitting(true)
    try {
      await auctionClient.withdrawFunds(parseInt(auction.id))
      setSuccessMessage("Funds withdrawn succesfully!")
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (err) {
      console.error("Error withdrawing funds:", err)
      handleError(
        err instanceof Error ? err.message : "Failed to withdraw funds"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWithdrawAuctionedItems = async () => {
    setIsSubmitting(true)
    try {
      await auctionClient.withdrawAuctionedItem(parseInt(auction.id))
      setSuccessMessage("Item withdrawn succesfully!")
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (err) {
      console.error("Error withdrawing auctioned items:", err)
      handleError(
        err instanceof Error
          ? err.message
          : "Failed to withdraw auctioned items"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto mt-16">
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column Skeleton */}
            <div className="space-y-6">
              <Skeleton className="aspect-square rounded-lg bg-gray-800" />
              <Skeleton className="h-[200px] rounded-lg bg-gray-800" />
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-10 w-2/3 bg-gray-800" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Skeleton className="h-[72px] bg-gray-800" />
                <Skeleton className="h-[72px] bg-gray-800" />
              </div>
              <Skeleton className="h-[200px] bg-gray-800" />
              <Skeleton className="h-12 bg-gray-800" />
              <Skeleton className="h-[300px] bg-gray-800" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column - Image */}
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-900"
              >
                <img
                  src={auction.imageUrl || "/placeholder.svg"}
                  alt={auction.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Description Section */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-semibold text-white">
                        Description
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                        className="text-gray-400"
                      >
                        {isDescriptionExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{
                        height: isDescriptionExpanded ? "auto" : "100px",
                      }}
                      className={cn(
                        "relative overflow-hidden text-gray-400",
                        !isDescriptionExpanded && "mask-linear-gradient"
                      )}
                    >
                      <p className="whitespace-pre-line">
                        {auction.description}
                      </p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Auction Details */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold mb-2">{auction.name}</h1>

                {/* Auction Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <User className="h-4 w-4" />
                          <span>Auctioneer</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  copyToClipboard(auction.auctioneer)
                                }
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                {`${auction.auctioneer.slice(
                                  0,
                                  6
                                )}...${auction.auctioneer.slice(-4)}`}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to copy address</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <LinkIcon className="h-4 w-4" />
                          <span>Token</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  copyToClipboard(auction.tokenAddress)
                                }
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                {`${auction.tokenAddress.slice(
                                  0,
                                  6
                                )}...${auction.tokenAddress.slice(-4)}`}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to copy address</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mb-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <User className="h-4 w-4" />
                          <span>
                            {auction.auctionType == Number(0)
                              ? "Token ID"
                              : "Token Amount"}
                          </span>
                        </div>
                        <div className="text-purple-400">
                          {auction.auctionType == Number(0)
                            ? auction.tokenIdOrAmount
                            : `${ethers.formatEther(
                                auction.tokenIdOrAmount
                              )} ETH`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Auction Status */}
                <Card className="bg-gray-900 border-gray-800 mb-6">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">
                          Current Bid
                        </div>
                        <div className="text-2xl font-bold text-purple-400">
                          {ethers.formatEther(auction.highestBid)} ETH
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">
                          Time Left
                        </div>
                        <div className="text-2xl font-bold text-yellow-500">
                          {timeRemaining}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">
                          Starting Bid
                        </div>
                        <div className="text-blue-100">
                          {ethers.formatEther(auction.startingBid)} ETH
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">
                          Minimum Increment
                        </div>
                        <div className="text-blue-100">
                          {ethers.formatEther(auction.minBidDelta)} ETH
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bid Input and Actions */}
                <div className="space-y-4">
                  <form onSubmit={handlePlaceBid} className="flex gap-4">
                    <Input
                      type="float"
                      placeholder="Enter bid amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="bg-gray-900 border-gray-800"
                      min={
                        Number(ethers.formatEther(auction.minBidDelta)) +
                        Number(ethers.formatEther(auction.highestBid))
                      }
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || isEnded}
                      className="bg-purple-600 hover:bg-purple-700 min-w-[120px]"
                    >
                      {isLoading ? "Placing Bid..." : "Place Bid"}
                    </Button>
                  </form>

                  <AnimatePresence>
                    {account == auction.auctioneer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Button
                          onClick={handleWithdrawFunds}
                          disabled={isSubmitting}
                          className="w-full bg-gray-800 hover:bg-gray-700"
                        >
                          Withdraw Funds
                        </Button>
                      </motion.div>
                    )}

                    {isEnded && auction.highestBidder == account && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Button
                          onClick={handleWithdrawAuctionedItems}
                          disabled={isSubmitting}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Claim Item
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bid History */}
                <Card className="bg-gray-900 border-gray-800 mt-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">
                      Bid History
                    </h3>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-4">
                        {bids.map((bid, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-800"
                          >
                            <div className="flex items-center gap-3">
                              <Gavel className="h-4 w-4 text-purple-400" />
                              <span className="text-gray-300">
                                {bid.bidder.slice(0, 6)}...
                                {bid.bidder.slice(-4)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-purple-400">
                                {ethers.formatEther(bid.amount)} ETH
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(
                                  Number(bid.timestamp) * 1000
                                ).toLocaleDateString() ===
                                new Date().toLocaleDateString()
                                  ? new Date(
                                      Number(bid.timestamp) * 1000
                                    ).toLocaleTimeString()
                                  : new Date(
                                      Number(bid.timestamp) * 1000
                                    ).toLocaleDateString()}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
      <Toaster />
    </div>
  )
}
