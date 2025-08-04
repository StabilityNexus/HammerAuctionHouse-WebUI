"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuctionGrid } from "@/components/auction/auction-grid";
import { Auction } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { User, PlusCircle} from "lucide-react";
import Link from "next/link";
import { useAccount, usePublicClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { decode, loadList } from "@/lib/storage";
import { getAuctionService } from "@/lib/auction-service";

export default function Dashboard() {
  const emptyAddress = "0x0000000000000000000000000000000000000000";
  const [activeTab, setActiveTab] = useState("created");
  const { isConnected, address} = useAccount();
  const [createdAuctions, setCreatedAuctions] = useState<Auction[]>([]);
  const [biddedAuctions, setBiddedAuctions] = useState<Auction[]>([]);
  const [watchedAuctions, setWatchedAuctions] = useState<Auction[]>([]);
  const publicClient = usePublicClient();
  
  const fetchCreatedAuctions = async () =>{
    try {
      const auctions = loadList("CreatedAuctions");
      const fetchedAuctions = await Promise.all(
        auctions.map(async (auctionData) => {
          const service = getAuctionService(decode(auctionData).protocol);
          const auction = await service.getAuction(BigInt(decode(auctionData).id),publicClient);
          if(auction.auctioneer==emptyAddress){return;}
          return auction;
        })
      );    
      setCreatedAuctions(fetchedAuctions.filter(auction => auction != null));
    } catch (error) {
      console.error("Error fetching created auctions:", error);
    }
  }

  const fetchBiddedAuctions = async () =>{
    try {
      const auctions = loadList("Bids");
      const fetchedAuctions = await Promise.all(
        auctions.map(async (auctionData) => {
          const service = getAuctionService(decode(auctionData).protocol);
          const auction = await service.getAuction(BigInt(decode(auctionData).id),publicClient);
          if(auction.auctioneer==emptyAddress){return;}
          return auction;
        })
      );      
      setBiddedAuctions(fetchedAuctions.filter(auction => auction != null));
    } catch (error) {
      console.error("Error fetching bidded auctions:", error);
    }
  }

  const fetchWatchedAuctions = async () =>{
    try {
      const auctions = loadList("WishList");
      const fetchedAuctions = await Promise.all(
        auctions.map(async (auctionData) => {
          const service = getAuctionService(decode(auctionData).protocol);
          const auction = await service.getAuction(BigInt(decode(auctionData).id),publicClient);
          if(auction.auctioneer==emptyAddress){return;}
          return auction;
        })
      );      
      setWatchedAuctions(fetchedAuctions.filter(auction => auction != null));
    } catch (error) {
      console.error("Error fetching watched auctions:", error);
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchCreatedAuctions().catch(console.error);
      fetchBiddedAuctions().catch(console.error);
      fetchWatchedAuctions().catch(console.error);
    }
  }, [address, isConnected]);

  return (
    <div className="container py-8 px-4 w-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {!isConnected ? "Connect Wallet" : "Your Dashboard"}
          </h1>
          {!isConnected ? (
            <p className="text-muted-foreground">
              Connect your wallet to view your dashboard.
            </p>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{`${address!.slice(0, 6)}...${address!.slice(-4)}`}</span>
            </div>
          )}
        </div>
        {!isConnected && <ConnectButton />}
      </div>

      {isConnected && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="created" className="mt-0">
              <div className="bg-muted/30 p-4 rounded-lg mb-6">
                <h2 className="font-semibold mb-1">Your Created Auctions</h2>
                <p className="text-sm text-muted-foreground">
                  Manage and track all auctions you&apos;ve created.
                </p>
              </div>
              
              {createdAuctions.length > 0 ? (
                <AuctionGrid auctions={createdAuctions} />
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <h3 className="text-lg font-medium mb-2">No auctions created yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first auction to start selling your items.
                  </p>
                  <Button asChild>
                    <Link href="/create">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Auction
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bids" className="mt-0">
              <div className="bg-muted/30 p-4 rounded-lg mb-6">
                <h2 className="font-semibold mb-1">Your Active Bids</h2>
                <p className="text-sm text-muted-foreground">
                  Track auctions where you&apos;ve placed bids.
                </p>
              </div>
              
              {biddedAuctions.length > 0 ? (
                <AuctionGrid auctions={biddedAuctions} />
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <h3 className="text-lg font-medium mb-2">No active bids</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven&apos;t placed any bids yet. Explore auctions to start bidding.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/auctions">Browse Auctions</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="watchlist" className="mt-0">
              <div className="bg-muted/30 p-4 rounded-lg mb-6">
                <h2 className="font-semibold mb-1">Your Watchlist</h2>
                <p className="text-sm text-muted-foreground">
                  Auctions you&apos;re keeping an eye on.
                </p>
              </div>
              
              {watchedAuctions.length > 0 ? (
                <AuctionGrid auctions={watchedAuctions} />
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Add auctions to your watchlist to keep track of them.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/auctions">Browse Auctions</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </motion.div>
        </Tabs>
      )}
    </div>
  );
}