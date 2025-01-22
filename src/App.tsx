import React from "react";
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

function App() {
  const [connected, setConnected] = React.useState(false);
  const [view, setView] = React.useState<"list" | "detail" | "create">("list");
  const [selectedAuction, setSelectedAuction] = React.useState<Auction | null>(
    null
  );

  const [auctions, setAuctions] = React.useState<Auction[]>([
    {
      id: "1",
      tokenAddress: "0x1234...5678",
      name: "Cosmic Voyager #42",
      description:
        "A rare NFT from the Cosmic Voyager collection featuring a unique blend of cosmic elements and futuristic design. This piece represents the convergence of space exploration and digital art.",
      imageUrl: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c",
      currentBid: 0.5,
      minBidAmount: 0.1,
      endTime: new Date(Date.now() + 86400000),
      status: "active",
      owner: "0xabcd...efgh",
      bids: [
        {
          bidder: "0x9876...5432",
          amount: 0.5,
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          bidder: "0x5432...1098",
          amount: 0.4,
          timestamp: new Date(Date.now() - 7200000),
        },
      ],
    },
    {
      id: "2",
      tokenAddress: "0x8765...4321",
      name: "Digital Dreams #17",
      description:
        "Part of the Digital Dreams series, this NFT captures the essence of cyberpunk aesthetics with a modern twist.",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
      currentBid: 1.2,
      minBidAmount: 0.2,
      endTime: new Date(Date.now() + 172800000),
      status: "active",
      owner: "0xijkl...mnop",
      bids: [
        {
          bidder: "0x3456...7890",
          amount: 1.2,
          timestamp: new Date(Date.now() - 1800000),
        },
      ],
    },
  ]);

  const connectWallet = () => {
    setConnected(true);
  };

  const handleCreateAuction = (newAuction: Auction) => {
    setAuctions([newAuction, ...auctions]);
    setView("list");
  };

  const handlePlaceBid = (amount: number) => {
    if (!selectedAuction) return;

    const newBid = {
      bidder: "0x1234...5678",
      amount: amount,
      timestamp: new Date(),
    };

    const updatedAuction = {
      ...selectedAuction,
      currentBid: amount,
      bids: [newBid, ...selectedAuction.bids],
    };

    setAuctions(
      auctions.map((a) => (a.id === selectedAuction.id ? updatedAuction : a))
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
            onClick={connectWallet}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              connected
                ? "bg-green-500/20 text-green-300"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{connected ? "0x1234...5678" : "Connect Wallet"}</span>
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
                          {auction.tokenAddress}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Gavel className="w-4 h-4" />
                          <span>Current Bid</span>
                        </div>
                        <span className="font-semibold text-purple-400">
                          {auction.currentBid} ETH
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Timer className="w-4 h-4" />
                          <span>Ends in</span>
                        </div>
                        <span className="text-yellow-400">
                          {new Date(auction.endTime).toLocaleTimeString()}
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
          <AuctionDetail
            auction={selectedAuction}
            onPlaceBid={handlePlaceBid}
          />
        )}

        {view === "create" && <CreateAuction onSubmit={handleCreateAuction} />}
      </main>
    </div>
  );
}

export default App;
