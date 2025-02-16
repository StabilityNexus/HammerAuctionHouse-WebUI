import { ethers } from "ethers";
import React from "react";
import { AllPayAuctionClient } from "../api.ts";

interface CreateAuctionProps {
  signer: ethers.Signer;
}

export function CreateAuction({ signer }: CreateAuctionProps) {
  const [createForm, setCreateForm] = React.useState({
    tokenAddress: "",
    name: "",
    description: "",
    imageUrl: "",
    duration: "24",
    auctionType: "",
    startingBid: "",
    deadlineExtension: "",
    minBidDelta: "",
    tokenAmountOrId: "",
  });

  const [successMessage, setSuccessMessage] = React.useState<string>("");

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auctionClient = new AllPayAuctionClient(
        "0x6c7c1E9726c5BD8414b73eeb0a54e82675847bCb",
        signer
      );

      //In this we have to ask for amount of token to be spend

      const result = await auctionClient.createAuction(
        createForm.name,
        createForm.description,
        createForm.imageUrl,
        Number(createForm.auctionType), // tokenId
        createForm.tokenAddress,
        ethers.parseEther(createForm.tokenAmountOrId), // reservePrice
        ethers.parseEther(createForm.startingBid), // startingBid
        ethers.parseEther(createForm.minBidDelta), // bidIncrement
        BigInt(createForm.deadlineExtension), // deadline extension
        BigInt(createForm.duration) // duration in seconds
      );

      setSuccessMessage("Auction created successfully!");
      // Clear message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
      console.log("Auction created", result);
    } catch (error) {
      console.error("Error creating auction:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded-lg mb-4 text-center">
          {successMessage}
        </div>
      )}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Auction</h2>
        <form onSubmit={handleCreateAuction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Auction Type
            </label>
            <select
              value={createForm.auctionType}
              onChange={(e) =>
                setCreateForm({ ...createForm, auctionType: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="0">NFT</option>
              <option value="1">ERC20</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Token Address
            </label>
            <input
              type="text"
              value={createForm.tokenAddress}
              onChange={(e) =>
                setCreateForm({ ...createForm, tokenAddress: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter token address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {createForm.auctionType === "0" ? "Token ID" : "Token Amount"}
            </label>
            <input
              type="number"
              value={createForm.tokenAmountOrId}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  tokenAmountOrId: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder={`Enter ${createForm.auctionType === "0" ? "Token ID" : "Token Amount"}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Starting Bid
            </label>
            <input
              type="text"
              value={createForm.startingBid}
              onChange={(e) =>
                setCreateForm({ ...createForm, startingBid: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter starting bid"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Minimum Bid Delta
            </label>
            <input
              type="text"
              value={createForm.minBidDelta}
              onChange={(e) =>
                setCreateForm({ ...createForm, minBidDelta: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter minimum bid delta"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Deadline Extension
            </label>
            <input
              type="number"
              value={createForm.deadlineExtension}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  deadlineExtension: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter time extension on each bid "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Name
            </label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter auction name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={createForm.description}
              onChange={(e) =>
                setCreateForm({ ...createForm, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter auction description"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={createForm.imageUrl}
              onChange={(e) =>
                setCreateForm({ ...createForm, imageUrl: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter image URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={createForm.duration}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  duration: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter time duration"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
          >
            Create Auction
          </button>
        </form>
      </div>
    </div>
  );
}
