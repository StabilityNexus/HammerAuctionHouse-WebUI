"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Auction } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  remove,
  append,
  loadList,
  isPresent,
  generateCode,
  decode,
} from "@/lib/storage";
import { useAccount, usePublicClient } from "wagmi";
import { etherUnits, formatEther } from "viem";
import { getTokenName } from "@/lib/auction-service";
import { add } from "lodash";

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const { isConnected, address } = useAccount();
  const [isWatched, setIsWatched] = useState(false);
  const auctionId = decode(auction.id).id;
  const publicClient = usePublicClient();
  useEffect(() => {
    setIsWatched(!!address && isPresent("WishList",auction.protocol, auctionId));
  }, [address, auction]);


  let status = "";
  if (Number(auction.deadline) * 1000 - Date.now() > 0) {
    status = "active";
  } else {
    status = "ended";
  }
  

  // Determine auction status text and color
  let statusConfig = {
    text: "Ended",
    bgColor: "bg-gray-500",
    textColor: "text-gray-500",
    bgOpacity: "bg-opacity-10",
  };

  if (status === "active") {
    statusConfig = {
      text: "Active",
      bgColor: "bg-green-500",
      textColor: "text-green-500",
      bgOpacity: "bg-opacity-10",
    };
  }

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isConnected) return;
    if (isWatched) {
      remove("WishList",auction.protocol, auctionId);
      console.log("Removed from watchlist:", auctionId);
      console.log("Current watchlist:", loadList("WishList"));
    } else {
      append("WishList",auction.protocol, auctionId);
      console.log("Added to watchlist:", auctionId);
    }
    setIsWatched(!isWatched);
  };


  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-card rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all border"
    >
      <Link href={`/auctions/${auction.id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <Image
            src={auction.imgUrl}
            alt={auction.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge
              className={cn(
                "px-2 py-1",
                statusConfig.bgColor,
                statusConfig.bgOpacity,
                statusConfig.textColor
              )}
            >
              {statusConfig.text}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full bg-background/80 backdrop-blur-xs text-muted-foreground hover:text-foreground",
                isWatched && "text-red-500 hover:text-red-600"
              )}
              onClick={toggleWatchlist}
            >
              <Heart className={cn("h-4 w-4", isWatched && "fill-current")} />
              <span className="sr-only">
                {isWatched ? "Remove from watchlist" : "Add to watchlist"}
              </span>
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg line-clamp-1">
              {auction.name}
            </h3>
            <Badge variant="outline" className="capitalize">
              {auction.protocol}
            </Badge>
          </div>

          <div className="mt-2 flex justify-between items-baseline">
            <div>
              <p className="text-muted-foreground text-sm">Auctioned Item</p>
              <p className="font-medium text-lg">
                {Number(formatEther(auction.auctionedTokenIdOrAmount)).toFixed(4)}{" "}{auction.auctionedTokenName || "Item"}
              </p>
            </div>

            <div className="flex items-center text-sm text-muted-foreground gap-1">
              <Clock className="h-3.5 w-3.5" />
              {status === "active" ? (
                <span>
                  Ends{" "}
                  {formatDistanceToNow(Number(auction.deadline) * 1000, {
                    addSuffix: true,
                  })}
                </span>
              ) : (
                <span>
                  Ended{" "}
                  {formatDistanceToNow(Number(auction.deadline) * 1000, {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t text-sm text-muted-foreground truncate">
            Created by{" "}
            {`${auction.auctioneer.substring(
              0,
              6
            )}...${auction.auctioneer.substring(38)}`}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
