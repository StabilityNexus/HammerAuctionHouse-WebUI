import { useEffect, useState, FormEvent } from "react";
import { Auction } from "../types";
import { formatTimeLeft, handleError } from "../utils";
import { AllPayAuctionClient } from "../api.ts";
import { ethers } from "ethers";
import { Toaster } from "react-hot-toast";

interface AuctionDetailProps {
  auction: Auction;
  signer: ethers.Signer;
}

interface Bid {
  bidder: string;
  amount: string;
  timestamp: number;
}

export function AuctionDetail({ auction, signer }: AuctionDetailProps) {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [bids, setBids] = useState<Bid[]>([]);
  const [address, setAddress] = useState<string>("");
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const client = new AllPayAuctionClient(
    "0x6c7c1E9726c5BD8414b73eeb0a54e82675847bCb",
    signer
  );

  const fetchBids = async () => {
    try {
      const fetchedBids = await client.getAuctionBids(parseInt(auction.id));
      setBids(fetchedBids);
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Failed to fetch bids");
    }
  };

  const fetchAddress = async () => {
    setAddress(await signer.getAddress());
  };

  const checkStatus = async () => {
    setIsEnded(await client.isEnded(parseInt(auction.id)));
  };

  useEffect(() => {
    fetchBids();
    fetchAddress();
    checkStatus();

    // Update time remaining every second
    const timer = setInterval(() => {
      const deadline = Number(auction.deadline) * 1000;
      if (deadline - Date.now() > 0) {
        setTimeRemaining(formatTimeLeft(new Date(deadline)));
      } else {
        setTimeRemaining("Auction Ended");
        setIsEnded(true);
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [auction.id, signer, auction.deadline]);

  const handlePlaceBid = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    handleError(null);

    try {
      const bidAmountInWei = ethers.parseEther(bidAmount);
      console.log(
        `Placing bid of ${bidAmountInWei} wei on auction ${auction.id}`
      );
      await client.placeBid(parseInt(auction.id), bidAmountInWei);
      setBidAmount("");
      await Promise.all([fetchBids(), checkStatus()]);
      setSuccessMessage("Bid placed succesfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawFunds = async () => {
    try {
      await client.withdrawFunds(parseInt(auction.id));
      setSuccessMessage("Funds withdrawn succesfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Error withdrawing funds:", err);
      handleError(
        err instanceof Error ? err.message : "Failed to withdraw funds"
      );
    }
  };

  const handleWithdrawAuctionedItems = async () => {
    try {
      await client.withdrawAuctionedItem(parseInt(auction.id));
      setSuccessMessage("Item withdrawn succesfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Error withdrawing auctioned items:", err);
      handleError(
        err instanceof Error
          ? err.message
          : "Failed to withdraw auctioned items"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
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
      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded-lg mb-4 text-center">
          {successMessage}
        </div>
      )}
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
                <span className="font-mono">
                  {`${auction.auctioneer.slice(0, 6)}...${auction.auctioneer.slice(-4)}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Token Address</span>
                <span className="font-mono">
                  {`${auction.tokenAddress.slice(0, 6)}...${auction.tokenAddress.slice(-4)}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Bid</span>
                <span className="text-xl font-bold text-purple-400">
                  {ethers.formatEther(auction.highestBid)} ETH
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Starting Bid</span>
                <span>{ethers.formatEther(auction.startingBid)} ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Minimum Bid Delta</span>
                <span>{ethers.formatEther(auction.minBidDelta)} ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Time Left</span>
                <span className="text-yellow-400">{timeRemaining}</span>
              </div>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Bid (ETH)
                </label>
                <input
                  type="text"
                  // step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter bid amount"
                  min={
                    Number(ethers.formatEther(auction.minBidDelta)) +
                    Number(ethers.formatEther(auction.highestBid))
                  }
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Place Bid"}
              </button>
            </form>

            <div className="flex-col">
              <button
                onClick={handleWithdrawFunds}
                disabled={auction.auctioneer !== address}
                className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold disabled:opacity-50 mb-4"
              >
                WithdrawFunds
              </button>
              <button
                onClick={handleWithdrawAuctionedItems}
                disabled={auction.highestBidder !== address || !isEnded}
                className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold disabled:opacity-50"
              >
                Claim Item
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Bid History</h3>
              <div className="space-y-3">
                {bids.map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm bg-gray-700/50 p-3 rounded-lg"
                  >
                    <span className="font-mono">
                      {bid.bidder.slice(0, 6)}...{bid.bidder.slice(-4)}
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className="text-purple-400">
                        {ethers.formatEther(bid.amount)} ETH
                      </span>
                      <span className="text-gray-400">
                        {new Date(
                          Number(bid.timestamp) * 1000
                        ).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                          ? new Date(
                              Number(bid.timestamp) * 1000
                            ).toLocaleTimeString()
                          : new Date(
                              Number(bid.timestamp) * 1000
                            ).toLocaleDateString()}
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
