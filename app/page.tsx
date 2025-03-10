"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Auction } from "@/lib/types"
import { formatTimeLeft, handleError } from "@/lib/utils"
import { ethers } from "ethers"
import { motion } from "framer-motion"
import { ArrowRight, Lock, Shield, Wallet, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAppContext } from "./context/AppContextProvider"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPage() {
  const {
    account,
    setAccount,
    connected,
    setConnected,
    signer,
    setSigner,
    auctionClient,
  } = useAppContext()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuctions = async () => {
      if (auctionClient) {
        try {
          setLoading(true)
          const fetchedAuctions = await auctionClient.getAllAuctions()
          setAuctions(fetchedAuctions.slice(0, 3))
        } catch (error: any) {
          handleError(error.message || "Failed to fetch auctions")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAuctions()
  }, [auctionClient])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: "url('/grid.svg')",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-8">
              <Image
                src="logo.svg"
                alt="HAH! Logo"
                width={180}
                height={180}
                className="mx-auto mb-8"
                style={{
                  filter: "invert(0.5) sepia(1) saturate(5) hue-rotate(180deg)",
                }}
              />
            </motion.div>
            <motion.h1
              variants={fadeIn}
              className="text-4xl sm:text-6xl font-bold tracking-tight mb-6"
            >
              Welcome to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                Hammer Auction House
              </span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-xl text-gray-400 max-w-2xl mx-auto mb-8"
            >
              Immutable, unstoppable smart contracts for various types of
              auctions.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/create-auction">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Create Auction <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/all-auctions">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-700 text-blue-900"
                >
                  View Active Auctions
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        </div>
      </div>

      {/* Live Auctions Preview */}
      <div className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeIn} className="text-center">
              <h2 className="text-2xl font-bold mb-2">Live Auctions</h2>
              <p className="text-gray-400">
                Check out some of our active auctions
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {loading
                ? // Skeleton loading cards
                  [...Array(3)].map((_, index) => (
                    <motion.div key={`skeleton-${index}`} variants={fadeIn}>
                      <Card className="bg-gray-900 border-gray-800 overflow-hidden h-[320px]">
                        <CardContent className="p-0 h-full flex flex-col">
                          <div className="aspect-video bg-gray-800 animate-pulse" />
                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3" />
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <div className="h-3 bg-gray-800 rounded animate-pulse w-1/4" />
                                <div className="h-3 bg-gray-800 rounded animate-pulse w-1/4" />
                              </div>
                              <div className="flex justify-between">
                                <div className="h-3 bg-gray-800 rounded animate-pulse w-1/4" />
                                <div className="h-3 bg-gray-800 rounded animate-pulse w-1/4" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                : auctions.map((auction) => (
                    <motion.div key={auction.id}>
                      <Link href={`/auction/${auction.id}`}>
                        <Card className="bg-gray-900 border-gray-800 overflow-hidden h-[320px]">
                          <CardContent className="p-0 h-full flex flex-col">
                            <div className="aspect-video bg-gray-800 relative">
                              {Number(auction.deadline) * 1000 - Date.now() >
                                0 && (
                                <div className="absolute top-2 right-2 bg-purple-600 text-white text-sm px-2 py-1 rounded">
                                  Live
                                </div>
                              )}
                              <Image
                                src={auction.imageUrl}
                                alt={auction.name}
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <h3 className="font-semibold mb-2 text-blue-100 line-clamp-1">
                                {auction.name}
                              </h3>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm text-gray-400">
                                  <span>Current Bid</span>
                                  <span>
                                    {ethers.formatEther(auction.highestBid)} ETH
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                  <span>Ends in</span>
                                  <span>
                                    {Number(auction.deadline) * 1000 -
                                      Date.now() >
                                    0
                                      ? formatTimeLeft(
                                          new Date(
                                            Number(auction.deadline) * 1000
                                          )
                                        )
                                      : "Auction Ended"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
            </motion.div>

            <motion.div variants={fadeIn} className="text-center">
              <Link href="/all-auctions">
                <Button
                  variant="outline"
                  className="border-purple-700 text-blue-900"
                >
                  View All Auctions <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-16"
        >
          <motion.div variants={fadeIn} className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose HAH!?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform leverages blockchain technology to provide a secure,
              transparent, and efficient auction experience.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Shield className="h-12 w-12 text-purple-400 " />,
                title: "Trustless & Secure",
                description:
                  "Smart contracts ensure fair and transparent auctions without intermediaries.",
              },
              {
                icon: <Lock className="h-12 w-12 text-purple-400" />,
                title: "Automated Escrow",
                description:
                  "Funds and assets are securely locked until auction completion.",
              },
              {
                icon: <Zap className="h-12 w-12 text-purple-400" />,
                title: "Instant Settlement",
                description:
                  "Automatic transfer of assets and funds upon auction end.",
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    {feature.icon}
                    <h3 className="text-lg font-semibold mb-2 text-blue-50">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-900" />
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: "url('/grid.svg')",
                backgroundSize: "30px 30px",
              }}
            />
            <div className="relative px-8 py-16">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Start Auctioning?
                </h2>
                <p className="text-gray-200 max-w-2xl mx-auto mb-8">
                  Join the future of decentralized auctions. Create your first
                  auction in minutes.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  {connected ? "Connected" : "Connect Wallet"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className=" border-gray-800 mt-12 pb-8 text-center text-sm text-gray-400">
          © 2025 Hammer Auction House. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
