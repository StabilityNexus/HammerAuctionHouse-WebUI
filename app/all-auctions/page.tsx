"use client"
import { Auction } from "@/lib/types"
import { formatTimeLeft, handleError } from "@/lib/utils"
import { ethers } from "ethers"
import { Gavel, Package, Timer } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import { useAppContext } from "../context/AppContextProvider"

export default function AllAuctions() {
  const { auctionClient } = useAppContext()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuctions = async () => {
      if (auctionClient) {
        try {
          setLoading(true)
          const fetchedAuctions = await auctionClient.getAllAuctions()
          setAuctions(fetchedAuctions)
        } catch (error: any) {
          handleError(error.message || "Failed to fetch auctions")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchAuctions()
  }, [auctionClient])

  const SkeletonCard = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 animate-pulse">
      <div className="w-full h-48 bg-gray-700" />
      <div className="p-4">
        <div className="h-6 bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-700 rounded mb-4" />

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-700 rounded" />
              <div className="h-4 w-20 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
          error: {
            style: {
              background: "#661111",
            },
          },
        }}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          ) : (
            auctions.map((auction) => (
              <Link href={`/auction/${auction.id}`} key={auction.id}>
                <div
                  key={auction.id}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer h-[400px] flex flex-col"
                  onClick={() => {}}
                >
                  <div className="h-48 w-full flex-shrink-0">
                    <img
                      src={auction.imageUrl}
                      alt={auction.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-2 truncate">
                      {auction.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                      {auction.description}
                    </p>

                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Package className="w-4 h-4" />
                          <span>Token Address</span>
                        </div>
                        <span className="font-mono">
                          {`${auction.tokenAddress.slice(
                            0,
                            6
                          )}...${auction.tokenAddress.slice(-4)}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Gavel className="w-4 h-4" />
                          <span>Current Bid</span>
                        </div>
                        <span className="font-semibold text-purple-400">
                          {ethers.formatEther(auction.highestBid)} ETH
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Timer className="w-4 h-4" />
                          <span>Ends in</span>
                        </div>
                        <span className="text-yellow-400">
                          {Number(auction.deadline) * 1000 - Date.now() > 0
                            ? formatTimeLeft(
                                new Date(Number(auction.deadline) * 1000)
                              )
                            : "Auction Ended"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
