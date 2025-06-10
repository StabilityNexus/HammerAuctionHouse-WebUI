"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Auction } from "@/lib/mock-data";
import { format } from "date-fns";

interface AuctionInfoProps {
  auction: Auction;
}

export function AuctionInfo({ auction }: AuctionInfoProps) {
  const infoItems = [
    {
      label: "Auction Type",
      value: auction.type.charAt(0).toUpperCase() + auction.type.slice(1),
      tooltip: getAuctionTypeDescription(auction.type),
    },
    {
      label: "Start Price",
      value: `${auction.startPrice} ETH`,
    },
    {
      label: "Reserve Price",
      value: auction.reservePrice ? `${auction.reservePrice} ETH` : "None",
      tooltip: "The minimum price that must be met for the auction to be successful",
    },
    {
      label: "Start Time",
      value: format(auction.startTime, "PPp"),
    },
    {
      label: "End Time",
      value: format(auction.endTime, "PPp"),
    }
  ];
  
  // Add auction-type specific parameters
  if (auction.type === "english" && auction.minBidDelta) {
    infoItems.push({
      label: "Minimum Bid Increment",
      value: `${auction.minBidDelta} ETH`,
      tooltip: "The minimum amount by which each new bid must exceed the current highest bid",
    });
  }
  
  if (auction.type === "dutch" && auction.decayFactor) {
    infoItems.push({
      label: "Decay Factor",
      value: auction.decayFactor.toString(),
      tooltip: "The rate at which the price decreases over time until a bid is placed or reserve price is reached",
    });
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TooltipProvider>
        {infoItems.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              {item.tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
}

function getAuctionTypeDescription(type: string): string {
  switch (type) {
    case "english":
      return "English auctions start at a minimum price and increase as bidders compete. The highest bid wins when the auction ends.";
    case "dutch":
      return "Dutch auctions start at a high price that gradually decreases until a bidder accepts the price.";
    case "all-pay":
      return "All-pay auctions require all participants to pay their bids regardless of whether they win.";
    case "vickrey":
      return "Vickrey (second-price sealed-bid) auctions have hidden bids where the highest bidder wins but pays the second-highest price.";
    default:
      return "";
  }
}