// Mock data for auctions


export type AuctionType = 'English' | 'Exponential' | 'AllPay' | 'Vickrey' | 'Linear' | 'Logarithmic';

export interface Bid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: number;
  timestamp: number;
}

//new interface
export interface Auction {
  protocol: AuctionType;
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  auctioneer: string;
  auctionType: string; // 0->NFT,1->ERC
  auctionedToken: string;
  auctionedTokenIdOrAmount: bigint;
  auctionedTokenName: string;
  biddingToken: string;
  biddingTokenName?: string;
  startingBid?: bigint;
  startingPrice?: bigint; // For Dutch auctions
  minBidDelta?: bigint;
  highestBid?: bigint;
  winner: string;
  deadline: bigint;
  deadlineExtension?: bigint;
  isClaimed: boolean;
  decayFactor?: bigint;
  duration?: bigint;
  reservedPrice?: bigint;
  scalingFactor?: bigint;
  winningBid?: bigint;
  bidCommitEnd?: bigint;
  bidRevealEnd?: bigint;
  startTime?: bigint;
  availableFunds?: bigint
}

// getUserBids and getUserWatchlist are not implemented due to missing data in Auction interface
export function getUserBids(userAddress: string): Auction[] {
  return [];
}

export function getUserWatchlist(userAddress: string): Auction[] {
  return [];
}

// export function getAuctionById(id: string): Auction | undefined {
//   return mockAuctions.find(auction => auction.id === id);
// }

// Mock bids data - specifically for AllPay auctions where everyone pays
export const mockBids: Bid[] = [
  // Bids for auction "1" (AllPay auction)
  {
    id: "bid-1-1",
    auctionId: "1",
    bidder: "0xa123456789012345678901234567890123456789",
    amount: 2.5,
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  },
  {
    id: "bid-1-2",
    auctionId: "1",
    bidder: "0xb123456789012345678901234567890123456789",
    amount: 3.2,
    timestamp: Date.now() - 1000 * 60 * 25, // 25 minutes ago
  },
  {
    id: "bid-1-3",
    auctionId: "1",
    bidder: "0xc123456789012345678901234567890123456789",
    amount: 4.1,
    timestamp: Date.now() - 1000 * 60 * 20, // 20 minutes ago
  },
  {
    id: "bid-1-4",
    auctionId: "1",
    bidder: "0xa123456789012345678901234567890123456789", // Same bidder increases bid
    amount: 5.0,
    timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
  },
  {
    id: "bid-1-5",
    auctionId: "1",
    bidder: "0xd123456789012345678901234567890123456789",
    amount: 6.8,
    timestamp: Date.now() - 1000 * 60 * 10, // 10 minutes ago
  },
  {
    id: "bid-1-6",
    auctionId: "1",
    bidder: "0xe123456789012345678901234567890123456789",
    amount: 8.5,
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
  },
];

// Get unique bidders for an auction
export function getUniqueBidders(auctionId: string): string[] {
  const bids = mockBids.filter(bid => bid.auctionId === auctionId);
  return [...new Set(bids.map(bid => bid.bidder))];
}