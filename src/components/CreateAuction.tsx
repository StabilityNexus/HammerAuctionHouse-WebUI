import React from "react";

interface CreateAuctionProps {
  onSubmit: (auction: any) => void;
}

export function CreateAuction({ onSubmit }: CreateAuctionProps) {
  const [createForm, setCreateForm] = React.useState({
    tokenAddress: "",
    name: "",
    description: "",
    imageUrl: "",
    minBidAmount: "",
    duration: "24",
  });

  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    const newAuction = {
      id: Math.random().toString(36).substr(2, 9),
      tokenAddress: createForm.tokenAddress,
      name: createForm.name,
      description: createForm.description,
      imageUrl:
        createForm.imageUrl ||
        "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c",
      currentBid: 0,
      minBidAmount: parseFloat(createForm.minBidAmount),
      endTime: new Date(Date.now() + parseInt(createForm.duration) * 3600000),
      status: "active" as const,
      owner: "0x1234...5678",
      bids: [],
    };
    onSubmit(newAuction);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Auction</h2>
        <form onSubmit={handleCreateAuction} className="space-y-6">
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
              Minimum Bid Amount (ETH)
            </label>
            <input
              type="number"
              step="0.01"
              value={createForm.minBidAmount}
              onChange={(e) =>
                setCreateForm({ ...createForm, minBidAmount: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter minimum bid amount"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Duration (hours)
            </label>
            <select
              value={createForm.duration}
              onChange={(e) =>
                setCreateForm({ ...createForm, duration: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="72">72 hours</option>
              <option value="168">7 days</option>
            </select>
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
