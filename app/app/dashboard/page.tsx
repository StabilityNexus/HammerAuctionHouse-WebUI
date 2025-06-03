"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletContext } from "@/providers/wallet-provider";
import { AuctionGrid } from "@/components/auction/auction-grid";
import { getUserAuctions, getUserBids, getUserWatchlist, mockAuctions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { User, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("created");
  const { isConnected, address, connect } = useWalletContext();
  const router = useRouter();
  
  if (!isConnected) {
    return (
      <div className="container py-12 px-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full bg-card border rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-6">Connect Wallet</h1>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to view your dashboard.
          </p>
          <Button size="lg" onClick={connect}>
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }
  
  // In a real app, we would fetch this data from the blockchain
  // For demo purposes, we'll use mock data
  const createdAuctions = getUserAuctions(address);
  const bidsPlaced = getUserBids(address);
  const watchlist = getUserWatchlist(address);
  
  // For demo purposes, if user has no auctions, show some from mock data
  const hasNoData = createdAuctions.length === 0 && bidsPlaced.length === 0 && watchlist.length === 0;
  
  // For demo, let's add the first 2 mock auctions to the created list
  const demoCreated = hasNoData ? mockAuctions.slice(0, 2) : createdAuctions;
  const demoBids = hasNoData ? [mockAuctions[2]] : bidsPlaced;
  const demoWatchlist = hasNoData ? [mockAuctions[3]] : watchlist;

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
          </div>
        </div>
        
        <Button asChild>
          <Link href="/create">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Auction
          </Link>
        </Button>
      </div>
      
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
                Manage and track all auctions you've created.
              </p>
            </div>
            
            {demoCreated.length > 0 ? (
              <AuctionGrid auctions={demoCreated} />
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
                Track auctions where you've placed bids.
              </p>
            </div>
            
            {demoBids.length > 0 ? (
              <AuctionGrid auctions={demoBids} />
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-2">No active bids</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any bids yet. Explore auctions to start bidding.
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
                Auctions you're keeping an eye on.
              </p>
            </div>
            
            {demoWatchlist.length > 0 ? (
              <AuctionGrid auctions={demoWatchlist} />
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
    </div>
  );
}