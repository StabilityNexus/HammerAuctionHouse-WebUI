"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Copy, CheckCircle2 } from "lucide-react";
import { Auction } from "@/lib/mock-data";
import { format } from "date-fns";
import React from "react";

interface AuctionInfoProps {
  auction: Auction;
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function AuctionInfo({ auction }: AuctionInfoProps) {
  const [copiedAddresses, setCopiedAddresses] = React.useState<{
    [key: string]: boolean;
  }>({});

  const copyToClipboard = (address: string, type: "asset" | "bidding") => {
    navigator.clipboard.writeText(address);
    setCopiedAddresses((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopiedAddresses((prev) => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const infoItems = [
    {
      label: "Auction Type",
      value:
        auction.protocol.charAt(0).toUpperCase() + auction.protocol.slice(1),
      tooltip: getAuctionTypeDescription(auction.protocol),
    },
    {
      label: "Asset",
      value: (
        <div className="flex items-center gap-2">
          <span>{shortenAddress(auction.auctionedToken)}</span>
          <button
            onClick={() => copyToClipboard(auction.auctionedToken, "asset")}
            className="hover:text-primary"
          >
            {copiedAddresses["asset"] ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      ),
    },
    {
      label: "Bidding Token",
      value: (
        <div className="flex items-center gap-2">
          <span>{shortenAddress(auction.biddingToken)}</span>
          <button
            onClick={() => copyToClipboard(auction.biddingToken, "bidding")}
            className="hover:text-primary"
          >
            {copiedAddresses["bidding"] ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      ),
    },
    {
      label: auction.protocol.toLowerCase().includes("dutch")
        ? "Initial Price"
        : "Start Price",
      value: `${
        auction.startingBid ? Number(auction.startingBid) / 1e18 : 0
      } ${auction.biddingTokenName || "ETH"}`,
    },
    {
      label: "End Time",
      value: format(Number(auction.deadline) * 1000, "PPp"),
    },
  ];

  // Add Dutch auction specific information
  if (auction.protocol.toLowerCase().includes("dutch")) {
    infoItems.push({
      label: "Reserve Price",
      value: `${
        auction.reservedPrice ? Number(auction.reservedPrice) / 1e18 : 0
      } ${auction.biddingTokenName || "ETH"}`,
      tooltip: "The minimum price at which the item can be sold",
    });

    // Add decay type and factor for non-linear Dutch auctions
    if (auction.protocol !== "Linear") {
      infoItems.push({
        label: "Decay Type",
        value: auction.protocol,
        tooltip:
          "The mathematical function used to calculate price decay over time",
      });

      if (auction.decayFactor) {
        infoItems.push({
          label: "Decay Factor",
          value:
            auction.protocol === "Exponential"
              ? (Number(auction.decayFactor) / 1e5).toFixed(5)
              : auction.decayFactor.toString(),
          tooltip:
            auction.protocol === "Exponential"
              ? "The exponential decay rate factor (scaled by 10^5). Higher values mean faster price decay."
              : "The rate at which the price decreases over time until someone buys or reserve price is reached",
        });
      }
    }
  }

  // Add auction-type specific parameters
  if (
    (auction.protocol === "English" || auction.protocol === "AllPay") &&
    auction.minBidDelta
  ) {
    infoItems.push({
      label: "Minimum Bid Increment",
      value: `${Number(auction.minBidDelta) / 1e18} ${auction.biddingTokenName || "ETH"}`,
      tooltip:
        "The minimum amount by which each new bid must exceed the current highest bid",
    });
  }

  if (auction.protocol === "AllPay") {
    infoItems.push({
      label: "Payment Model",
      value: "All bidders pay",
      tooltip:
        "In AllPay auctions, every bidder must pay their bid amount, regardless of winning",
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TooltipProvider>
        {infoItems.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
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
    case "English":
      return "English auctions start at a minimum price and increase as bidders compete. The highest bid wins when the auction ends.";
    case "Linear":
      return "Linear Dutch auctions start at a high price that decreases linearly over time until a bidder accepts the current price.";
    case "Exponential":
      return "Exponential Dutch auctions start at a high price that decreases exponentially over time using a decay factor. Price drops faster initially, then slows down.";
    case "Logarithmic":
      return "Logarithmic Dutch auctions start at a high price that decreases logarithmically over time. Price drops slowly initially, then faster later.";
    case "AllPay":
      return "All-pay auctions require all participants to pay their bids regardless of whether they win.";
    case "Vickrey":
      return "Vickrey (second-price sealed-bid) auctions have hidden bids where the highest bidder wins but pays the second-highest price.";
    default:
      return "";
  }
}
