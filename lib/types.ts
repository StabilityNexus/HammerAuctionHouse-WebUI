export type AuctionType = 'English' | 'Exponential' | 'AllPay' | 'Vickrey' | 'Linear' | 'Logarithmic';
export interface Bid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: number;
  timestamp: number;
}
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
  currentPrice?: bigint;
  settlePrice?: bigint;
  protocolFee: bigint;
  commitFee?: bigint;
  accumulatedCommitFee?: bigint;
}
