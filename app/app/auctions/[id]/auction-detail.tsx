"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/auction/countdown-timer";
import { AuctionInfo } from "@/components/auction/auction-info";
import { BidHistory } from "@/components/auction/bid-history";
import { BidForm } from "@/components/auction/bid-form";
import { BidVariationChart } from "@/components/auction/bid-variation-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Auction } from "@/lib/mock-data";

interface AuctionDetailProps {
  auction: Auction | undefined;
}

export function AuctionDetail({ auction }: AuctionDetailProps) {
  const [currentAuction, setCurrentAuction] = useState(auction);
  
  if (!currentAuction) {
    return (
      <div className="container py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Auction Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The auction you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/auctions">Back to Auctions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link href="/auctions" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Auctions
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted rounded-xl overflow-hidden aspect-square relative"
        >
          <img
            src={currentAuction.imageUrl}
            alt={currentAuction.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-4 right-4">
            <Badge 
              status={currentAuction.status} 
              type={currentAuction.type} 
            />
          </div>
        </motion.div>
        
        {/* Right column - Auction details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold">{currentAuction.title}</h1>
          <p className="text-muted-foreground mt-2 mb-4">
            Created by {`${currentAuction.creator.substring(0, 6)}...${currentAuction.creator.substring(38)}`}
          </p>
          
          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                <p className="text-3xl font-bold">{currentAuction.currentPrice} ETH</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Auction Status</p>
                <CountdownTimer 
                  endTime={currentAuction.endTime}
                  startTime={currentAuction.startTime}
                  status={currentAuction.status}
                />
              </div>
            </div>
            
            {currentAuction.status === "active" && (
              <BidForm 
                auction={currentAuction} 
                onBidPlaced={(newBid) => {
                  setCurrentAuction({
                    ...currentAuction,
                    currentPrice: newBid.amount,
                    bids: [...currentAuction.bids, newBid],
                  });
                }}
              />
            )}
            
            {currentAuction.status === "upcoming" && (
              <div className="bg-blue-500/10 text-blue-500 p-4 rounded-lg flex items-start">
                <Clock className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
                <p>
                  This auction hasn't started yet. Come back when it begins, or add it to your watchlist to receive notifications.
                </p>
              </div>
            )}
            
            {currentAuction.status === "ended" && (
              <div className="bg-muted p-4 rounded-lg flex items-start">
                <Info className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">This auction has ended</p>
                  {currentAuction.bids.length > 0 ? (
                    <p className="text-muted-foreground">
                      Final price: {currentAuction.currentPrice} ETH
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No bids were placed on this auction
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {currentAuction.bids.length > 0 && (
            <div className="mb-6">
              <BidVariationChart bids={currentAuction.bids} />
            </div>
          )}
          
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">Bid History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-muted-foreground mt-1">{currentAuction.description}</p>
                </div>
                
                <Separator />
                
                <AuctionInfo auction={currentAuction} />
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="pt-4">
              <BidHistory bids={currentAuction.bids} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

function Badge({ status, type }: { status: string; type: string }) {
  let bgColor = "bg-blue-500/10 text-blue-500";
  
  if (status === "active") {
    bgColor = "bg-green-500/10 text-green-500";
  } else if (status === "ended") {
    bgColor = "bg-gray-500/10 text-gray-500";
  }
  
  return (
    <div className={`px-3 py-1.5 rounded-lg font-medium text-sm ${bgColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)} • {type.charAt(0).toUpperCase() + type.slice(1)}
    </div>
  );
}