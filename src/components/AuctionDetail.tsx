import React from "react";
// import { Timer } from "lucide-react";
import { Auction } from "../types";
import { formatTimeLeft } from "../utils";

interface AuctionDetailProps {
  auction: Auction;
  onPlaceBid: (amount: number) => void;
}

export function AuctionDetail({ auction, onPlaceBid }: AuctionDetailProps) {
  const [bidAmount, setBidAmount] = React.useState<string>("");

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceBid(parseFloat(bidAmount));
    setBidAmount("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6">
            <img
              src={auction.imageUrl}
              alt={auction.name}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{auction.name}</h2>
            <p className="text-gray-400 mb-6">{auction.description}</p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Owner</span>
                <span className="font-mono">{auction.owner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Bid</span>
                <span className="text-xl font-bold text-purple-400">
                  {auction.currentBid} ETH
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Minimum Bid</span>
                <span>{auction.minBidAmount} ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Time Left</span>
                <span className="text-yellow-400">
                  {formatTimeLeft(auction.endTime)}
                </span>
              </div>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Bid (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter bid amount"
                  min={auction.minBidAmount}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
              >
                Place Bid
              </button>
            </form>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Bid History</h3>
              <div className="space-y-3">
                {auction.bids.map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm bg-gray-700/50 p-3 rounded-lg"
                  >
                    <span className="font-mono">{bid.bidder}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-purple-400">{bid.amount} ETH</span>
                      <span className="text-gray-400">
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
