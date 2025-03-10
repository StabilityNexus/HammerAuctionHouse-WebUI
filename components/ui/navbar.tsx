"use client"

import { useAppContext } from "@/app/context/AppContextProvider"
import { Button } from "@/components/ui/button"
import { AllPayAuctionClient } from "@/lib/api"
import { connectWallet, handleError } from "@/lib/utils"
import { Wallet } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"

export default function Navbar() {
  const {
    account,
    setAccount,
    connected,
    setConnected,
    signer,
    setSigner,
    setAuctionClient,
  } = useAppContext()

  const handleConnect = async () => {
    try {
      const wallet = await connectWallet() //Add a custom wallet connection function
      if (wallet && wallet.address) {
        setAccount(wallet.address)
        setConnected(true)
        setSigner(wallet.signer)
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletAddress", wallet.address)
        const client = new AllPayAuctionClient(
          "0x7c95E2aAaE74289AA1838c999D901af9ed62f9eD",
          wallet.signer
        )
        setAuctionClient(client)
      }
    } catch (error: any) {
      handleError(error.message || "Failed to connect wallet")
    }
  }

  useEffect(() => {
    const autoConnect = async () => {
      const isConnected = localStorage.getItem("walletConnected") === "true"
      if (isConnected) {
        await handleConnect()
      }
    }

    autoConnect()
  }, [])

  return (
    <nav className="border-b border-gray-800 fixed w-full top-0 z-50 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="HAH! Logo"
                width={60}
                height={60}
                className="w-10 h-10"
                style={{
                  filter: "invert(0.5) sepia(1) saturate(5) hue-rotate(180deg)",
                }}
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                HAH!
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/all-auctions">
              <Button variant="ghost" className="text-gray-300">
                Browse Auctions
              </Button>
            </Link>

            <Link href="/create-auction">
              <Button variant="ghost" className="text-gray-300">
                Create Auction
              </Button>
            </Link>

            <Button
              onClick={handleConnect}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {connected
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
