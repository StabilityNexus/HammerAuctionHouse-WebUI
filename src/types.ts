export interface Auction {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  auctionType: number;
  auctioneer: string;
  tokenAddress: string;
  tokenIdOrAmount: string;
  startingBid: string;
  highestBid: string;
  highestBidder: string;
  deadline: string;
  minBidDelta: string;
  deadlineExtension: string;
  totalBids: string;
  availableFunds: string;
}
