// Mock data for auctions

export type AuctionType = 'english' | 'dutch' | 'all-pay' | 'vickrey';

export interface Bid {
  id: string;
  bidder: string;
  amount: number;
  timestamp: number;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creator: string;
  type: AuctionType;
  startPrice: number;
  reservePrice?: number;
  currentPrice: number;
  startTime: number;
  endTime: number;
  minBidDelta?: number;
  decayFactor?: number;
  tokenAddress?: string;
  status: 'upcoming' | 'active' | 'ended';
  bids: Bid[];
  watchedBy: string[];
}

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

// Generate random wallet address
const randomAddress = () => {
  return "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
};

export const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "Cosmic Voyager #42",
    description: "A rare NFT from the Cosmic Voyagers collection. This piece represents the journey through the astral plane with vibrant colors and intricate details.",
    imageUrl: "https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg?auto=compress&cs=tinysrgb&w=800",
    creator: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    type: "english",
    startPrice: 1.5,
    reservePrice: 3.0,
    currentPrice: 2.75,
    startTime: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days from now
    minBidDelta: 0.1,
    status: "active",
    bids: [
      {
        id: "bid1",
        bidder: "0xbidder1",
        amount: 1.5,
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1.5,
      },
      {
        id: "bid2",
        bidder: "0xbidder2",
        amount: 2.0,
        timestamp: Date.now() - 1000 * 60 * 60 * 12,
      },
      {
        id: "bid3",
        bidder: "0xbidder3",
        amount: 2.75,
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      },
    ],
    watchedBy: ["0xuser1", "0xuser2"],
  },
  {
    id: "2",
    title: "Digital Renaissance #7",
    description: "A masterpiece blending traditional art with digital techniques. This NFT showcases the evolution of artistic expression in the digital age.",
    imageUrl: "https://images.pexels.com/photos/3573555/pexels-photo-3573555.jpeg?auto=compress&cs=tinysrgb&w=800",
    creator: "0xcreator2",
    type: "dutch",
    startPrice: 5.0,
    reservePrice: 2.0,
    currentPrice: 3.5,
    startTime: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 2, // 2 days from now
    decayFactor: 0.1,
    status: "active",
    bids: [],
    watchedBy: ["0xuser3"],
  },
];

// Generate 10 more random auctions
for (let i = 0; i < 10; i++) {
  const isActive = Math.random() > 0.3;
  const isUpcoming = !isActive && Math.random() > 0.5;
  const isEnded = !isActive && !isUpcoming;
  
  let status: 'upcoming' | 'active' | 'ended';
  let startTime: number;
  let endTime: number;
  
  if (isUpcoming) {
    status = 'upcoming';
    startTime = randomFutureDate();
    endTime = startTime + 1000 * 60 * 60 * 24 * (3 + Math.random() * 7); // 3-10 days after start
  } else if (isActive) {
    status = 'active';
    startTime = randomPastDate();
    endTime = randomFutureDate();
  } else {
    status = 'ended';
    endTime = randomPastDate();
    startTime = endTime - 1000 * 60 * 60 * 24 * (3 + Math.random() * 7); // 3-10 days before end
  }
  
  // Generate random auction type
  const auctionTypes: AuctionType[] = ['english', 'dutch', 'all-pay', 'vickrey'];
  const type = auctionTypes[Math.floor(Math.random() * auctionTypes.length)];
  
  const startPrice = Math.round((0.5 + Math.random() * 10) * 100) / 100;
  const currentPrice = status === 'upcoming' ? startPrice : 
                       (Math.round((startPrice + Math.random() * 5) * 100) / 100);
  
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
  
  // Generate random bids if the auction is active or ended
  const numBids = status !== 'upcoming' ? Math.floor(Math.random() * 5) : 0;
  const bids: Bid[] = [];
  
  for (let j = 0; j < numBids; j++) {
    const amount = Math.round((currentPrice - 0.5 + Math.random()) * 100) / 100;
    const bidTime = status === 'ended' ? 
                  (startTime + Math.random() * (endTime - startTime)) : 
                  (startTime + Math.random() * (Date.now() - startTime));
    
    bids.push({
      id: `bid-${i}-${j}`,
      bidder: randomAddress(),
      amount,
      timestamp: bidTime,
    });
  }
  
  // Sort bids by timestamp
  bids.sort((a, b) => a.timestamp - b.timestamp);
  
  mockAuctions.push({
    id: `${i + 3}`,
    title: `${names[Math.floor(Math.random() * names.length)]} #${Math.floor(Math.random() * 100)}`,
    description: "A unique digital collectible showcasing the intersection of art and technology.",
    imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
    creator: randomAddress(),
    type,
    startPrice,
    reservePrice: Math.random() > 0.5 ? Math.round((startPrice * 1.5) * 100) / 100 : undefined,
    currentPrice,
    startTime,
    endTime,
    minBidDelta: type === 'english' ? 0.1 : undefined,
    decayFactor: type === 'dutch' ? 0.05 + Math.random() * 0.2 : undefined,
    status,
    bids,
    watchedBy: Math.random() > 0.7 ? [randomAddress()] : [],
  });
}

export function getUserAuctions(userAddress: string): Auction[] {
  return mockAuctions.filter(auction => auction.creator === userAddress);
}

export function getUserBids(userAddress: string): Auction[] {
  return mockAuctions.filter(auction => 
    auction.bids.some(bid => bid.bidder === userAddress)
  );
}

export function getUserWatchlist(userAddress: string): Auction[] {
  return mockAuctions.filter(auction => 
    auction.watchedBy.includes(userAddress)
  );
}

export function getAuctionById(id: string): Auction | undefined {
  return mockAuctions.find(auction => auction.id === id);
}