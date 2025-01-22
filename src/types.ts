export interface Auction {
  id: string;
  tokenAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  currentBid: number;
  minBidAmount: number;
  endTime: Date;
  status: "active" | "ended";
  owner: string;
  bids: {
    bidder: string;
    amount: number;
    timestamp: Date;
  }[];
}
