import { useState, useEffect } from "react";
import { AllPayAuctionClient } from "./api.ts";
import {
  Wallet,
  Timer,
  Package,
  Gavel,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";
import { CreateAuction } from "./components/CreateAuction";
import { AuctionDetail } from "./components/AuctionDetail";
import { Auction } from "./types";
import { connectWallet, formatTimeLeft, handleError } from "./utils";
import { ethers } from "ethers";
import { Toaster } from "react-hot-toast";

function App() {
  const [account, setAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [signer, setSigner] = useState<any>(null);
  const [view, setView] = useState<"list" | "detail" | "create">("list");
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [auctionClient, setAuctionClient] =
    useState<AllPayAuctionClient | null>(null);

  const [auctions, setAuctions] = useState<Auction[]>([]);

  const handleConnect = async () => {
    try {
      const wallet = await connectWallet();
      if (wallet && wallet.address) {
        setAccount(wallet.address);
        setConnected(true);
        setSigner(wallet.signer);
        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAddress", wallet.address);

        const client = new AllPayAuctionClient(
          "0x6c7c1E9726c5BD8414b73eeb0a54e82675847bCb",
          wallet.signer
        );
        setAuctionClient(client);
      }
    } catch (error: any) {
      handleError(error.message || "Failed to connect wallet");
    }
  };

  useEffect(() => {
    const autoConnect = async () => {
      const isConnected = localStorage.getItem("walletConnected") === "true";
      if (isConnected) {
        await handleConnect();
      }
    };

    autoConnect();
  }, []);

  useEffect(() => {
    const fetchAuctions = async () => {
      if (auctionClient) {
        try {
          const fetchedAuctions = await auctionClient.getAllAuctions();
          fetchedAuctions.reverse();
          setAuctions(fetchedAuctions);
          console.log("Fetched auctions:", fetchedAuctions);
        } catch (error: any) {
          handleError(error.message || "Failed to fetch auctions");
        }
      }
    };

    fetchAuctions();
  }, [auctionClient]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm fixed w-full z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {view !== "list" && (
              <button
                onClick={() => setView("list")}
                className="mr-4 hover:text-purple-400"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <Gavel className="w-6 h-6 text-purple-500" />
            <span className="text-xl font-bold">NFT Auction House</span>
          </div>
          <button
            onClick={handleConnect}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              connected
                ? "bg-green-500/20 text-green-300"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>
              {connected
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Connect Wallet"}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        {view === "list" && (
          <>
            {/* Create Auction Button */}
            <div className="mb-8">
              <button
                onClick={() => setView("create")}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Auction</span>
              </button>
            </div>

            {/* Auctions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <div
                  key={auction.id}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedAuction(auction);
                    setView("detail");
                  }}
                >
                  <img
                    src={auction.imageUrl}
                    alt={auction.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {auction.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {auction.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Package className="w-4 h-4" />
                          <span>Token Address</span>
                        </div>
                        <span className="font-mono">
                          {`${auction.tokenAddress.slice(0, 6)}...${auction.tokenAddress.slice(-4)}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Gavel className="w-4 h-4" />
                          <span>Current Bid</span>
                        </div>
                        <span className="font-semibold text-purple-400">
                          {ethers.formatEther(auction.highestBid)} ETH
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Timer className="w-4 h-4" />
                          <span>Ends in</span>
                        </div>
                        <span className="text-yellow-400">
                          {Number(auction.deadline) * 1000 - Date.now() > 0
                            ? formatTimeLeft(
                                new Date(Number(auction.deadline) * 1000)
                              )
                            : "Auction Ended"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "detail" && selectedAuction && (
          <AuctionDetail auction={selectedAuction} signer={signer} />
        )}

        {view === "create" && <CreateAuction signer={signer} />}
      </main>
    </div>
  );
}

export default App;
