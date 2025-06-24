// Mock data for auctions

import { Address } from "viem";

export type AuctionType = 'English' | 'Exponential' | 'AllPay' | 'Vickrey' | 'Linear' | 'Logarithmic';

export interface Bid {
  auctionId: string;
  bidder: string;
  bidAmount: number;
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
  biddingToken: string;
  startingBid?: bigint;
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
}

// Random image URLs from Pexels
const imageUrls = [
  "https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2419375/pexels-photo-2419375.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4100130/pexels-photo-4100130.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3826435/pexels-photo-3826435.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2693529/pexels-photo-2693529.png?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3222686/pexels-photo-3222686.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const names = [
  "Ethereal Dreams",
  "Digital Genesis",
  "Neon Horizon",
  "Quantum Fragment",
  "Stellar Odyssey",
  "Crypto Punk",
  "Virtual Realm",
  "Metaverse Portal",
  "Blockchain Artifact",
  "Genesis Token"
];

// Generate a random future date (between now and 14 days from now)
const randomFutureDate = () => {
  const now = Date.now();
  const futureDate = now + (1000 * 60 * 60 * 24 * Math.random() * 14); // 0-14 days in the future
  return futureDate;
};

// Generate a random past date (between 14 days ago and now)
const randomPastDate = () => {
  const now = Date.now();
  const pastDate = now - (1000 * 60 * 60 * 24 * Math.random() * 14); // 0-14 days in the past
  return pastDate;
};

// Generate random wAllPayet address
const randomAddress = () => {
  return "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
};

// Helper for random bigints
const randomBigInt = (min: number, max: number) => {
  return BigInt(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const mockAuctions: Auction[] = [
  {
    protocol: "AllPay",
    id: "1",
    name: "Cosmic Voyager #42",
    description: "A rare NFT from the Cosmic Voyagers collection. This piece represents the journey through the astral plane with vibrant colors and intricate details.",
    imgUrl: "https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg?auto=compress&cs=tinysrgb&w=800",
    auctioneer: randomAddress(),
    auctionType: "1",
    auctionedToken: randomAddress(),
    auctionedTokenIdOrAmount: randomBigInt(1, 100),
    biddingToken: randomAddress(),
    startingBid: randomBigInt(1, 10),
    minBidDelta: randomBigInt(1, 5),
    highestBid: randomBigInt(10, 20),
    winner: randomAddress(),
    deadline: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 3),
    deadlineExtension: randomBigInt(100, 500),
    isClaimed: false,
  },
];

// Generate 10 more random auctions
for (let i = 0; i < 10; i++) {
  const isActive = Math.random() > 0.3;
  const isUpcoming = !isActive && Math.random() > 0.5;
  const isEnded = !isActive && !isUpcoming;

  let status: 'upcoming' | 'active' | 'ended';
  let startTime: bigint;
  let deadline: bigint;

  if (isUpcoming) {
    status = 'upcoming';
    startTime = BigInt(Math.floor(randomFutureDate()));
    deadline = startTime + BigInt(1000 * 60 * 60 * 24 * (3 + Math.random() * 7));
  } else if (isActive) {
    status = 'active';
    startTime = BigInt(Math.floor(randomPastDate()));
    deadline = BigInt(Math.floor(randomFutureDate()));
  } else {
    status = 'ended';
    deadline = BigInt(Math.floor(randomPastDate()));
    startTime = deadline - BigInt(1000 * 60 * 60 * 24 * (3 + Math.random() * 7));
  }

  const auctionTypes: AuctionType[] = ['English', 'AllPay']; //for now only these
  const protocol = auctionTypes[Math.floor(Math.random() * auctionTypes.length)];

  const startingBid = randomBigInt(1, 10);
  const minBidDelta = randomBigInt(1, 5);
  const highestBid = status !== 'upcoming' ? startingBid + randomBigInt(1, 10) : undefined;
  const winner = status === 'ended' ? randomAddress() : "";

  mockAuctions.push({
    protocol,
    id: `${i + 2}`,
    name: `${names[Math.floor(Math.random() * names.length)]} #${Math.floor(Math.random() * 100)}`,
    description: "A unique digital collectible showcasing the intersection of art and technology.",
    imgUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
    auctioneer: randomAddress(),
    auctionType: Math.random() > 0.5 ? "0" : "1",
    auctionedToken: randomAddress(),
    auctionedTokenIdOrAmount: randomBigInt(1, 100),
    biddingToken: randomAddress(),
    startingBid,
    minBidDelta,
    highestBid,
    winner,
    deadline,
    deadlineExtension: randomBigInt(100, 500),
    isClaimed: status === 'ended',
    decayFactor: protocol === 'Linear' ? randomBigInt(1, 10) : undefined,
    duration: randomBigInt(1, 1000),
    reservedPrice: Math.random() > 0.5 ? randomBigInt(10, 50) : undefined,
    scalingFactor: Math.random() > 0.5 ? randomBigInt(1, 10) : undefined,
    winningBid: highestBid,
    bidCommitEnd: undefined,
    bidRevealEnd: undefined,
    startTime,
  });
}

export function getUserAuctions(userAddress: string): Auction[] {
  return mockAuctions.filter(auction => auction.auctioneer === userAddress);
}

// getUserBids and getUserWatchlist are not implemented due to missing data in Auction interface
export function getUserBids(userAddress: string): Auction[] {
  return [];
}

export function getUserWatchlist(userAddress: string): Auction[] {
  return [];
}

export function getAuctionById(id: string): Auction | undefined {
  return mockAuctions.find(auction => auction.id === id);
}