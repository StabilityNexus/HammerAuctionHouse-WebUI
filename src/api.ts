import { ethers, Contract, Signer } from "ethers";

interface AuctionData {
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

interface BidEvent {
  auctionId: string;
  bidder: string;
  amount: string;
  timestamp: number;
}

const ABI = [
  "event AuctionCreated(uint256 indexed auctionId, string name, string description, string imageUrl, uint8 auctionType, address indexed auctioneer, address tokenAddress, uint256 tokenIdOrAmount, uint256 startingBid, uint256 highestBid, uint256 deadline)",
  "event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount)",
  "function createAuction(string memory name, string memory description, string memory imageUrl, uint8 auctionType, address tokenAddress, uint256 tokenIdOrAmount, uint256 startingBid, uint256 minBidDelta, uint256 deadlineExtension, uint256 deadline) external returns (uint256)",
  "function placeBid(uint256 auctionId) external payable",
  "function hasEnded(uint256 auctionId) external view returns (bool)",
  "function withdrawAuctionedItem(uint256 auctionId) external",
  "function withdrawFunds(uint256 auctionId) external",
  "function auctions(uint256) external view returns (uint256 id, string name, string description, string imageUrl, uint8 auctionType, address auctioneer, address tokenAddress, uint256 tokenIdOrAmount, uint256 startingBid, uint256 highestBid, address highestBidder, uint256 deadline, uint256 minBidDelta, uint256 deadlineExtension, uint256 totalBids, uint256 availableFunds)",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
];

const ERC721_ABI = [
  "function approve(address to, uint256 tokenId)",
  "function balanceOf(address) view returns (uint256)",
];

export class AllPayAuctionClient {
  private contract: Contract;

  constructor(contractAddress: string, signer: Signer | ethers.Provider) {
    this.contract = new ethers.Contract(contractAddress, ABI, signer);
  }

  async createAuction(
    name: string,
    description: string,
    imageUrl: string,
    auctionType: number,
    tokenAddress: string,
    tokenIdOrAmount: bigint,
    startingBid: bigint,
    minBidDelta: bigint,
    deadlineExtension: bigint,
    deadline: bigint
  ): Promise<ethers.ContractTransactionReceipt> {
    try {
      if (auctionType === 0) {
        const nftContract = new ethers.Contract(
          tokenAddress,
          ERC721_ABI,
          this.contract.runner
        );
        const tx = await nftContract.approve(
          this.contract.target,
          tokenIdOrAmount
        );
        await tx.wait();
      } else {
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ERC20_ABI,
          this.contract.runner
        );
        const tx = await tokenContract.approve(
          this.contract.target,
          tokenIdOrAmount
        );
        await tx.wait();
      }

      const tx = await this.contract.createAuction(
        name,
        description,
        imageUrl,
        auctionType,
        tokenAddress,
        tokenIdOrAmount,
        startingBid,
        minBidDelta,
        deadlineExtension,
        deadline
      );
      return await tx.wait();
    } catch (error) {
      console.error("Error creating auction:", error);
      throw error;
    }
  }

  async placeBid(
    auctionId: number,
    bidAmount: bigint
  ): Promise<ethers.ContractTransactionReceipt> {
    try {
      const tx = await this.contract.placeBid(auctionId, {
        value: bidAmount,
      });
      return await tx.wait();
    } catch (error) {
      console.error("Error placing bid:", error);
      throw error;
    }
  }

  async isEnded(auctionId: number): Promise<boolean> {
    return this.contract.hasEnded(auctionId);
  }

  async withdrawAuctionedItem(
    auctionId: number
  ): Promise<ethers.ContractTransactionReceipt> {
    return await this.contract.withdrawAuctionedItem(auctionId);
  }

  async withdrawFunds(
    auctionId: number
  ): Promise<ethers.ContractTransactionReceipt> {
    return await this.contract.withdrawFunds(auctionId);
  }

  async getAuction(auctionId: number): Promise<AuctionData> {
    const auction = await this.contract.auctions(auctionId);
    return {
      id: auction.id.toString(),
      name: auction.name,
      description: auction.description,
      imageUrl: auction.imageUrl,
      auctionType: auction.auctionType,
      auctioneer: auction.auctioneer,
      tokenAddress: auction.tokenAddress,
      tokenIdOrAmount: auction.tokenIdOrAmount.toString(),
      startingBid: auction.startingBid.toString(),
      highestBid: auction.highestBid.toString(),
      highestBidder: auction.highestBidder,
      deadline: auction.deadline.toString(), // Blockchain stores timestamp in seconds
      minBidDelta: auction.minBidDelta.toString(),
      deadlineExtension: auction.deadlineExtension.toString(),
      totalBids: auction.totalBids.toString(),
      availableFunds: auction.availableFunds.toString(),
    };
  }

  async getAllAuctions(): Promise<AuctionData[]> {
    const events = await this.contract.queryFilter("AuctionCreated");
    if (events.length === 0) return [];

    const lastAuctionId = parseInt(
      (events[events.length - 1] as ethers.EventLog).args.auctionId.toString()
    );
    const auctions: AuctionData[] = [];

    for (let i = 0; i <= lastAuctionId; i++) {
      try {
        const auction = await this.getAuction(i);
        auctions.push(auction);
      } catch (error) {
        console.error(`Error fetching auction ${i}:`, error);
      }
    }

    return auctions;
  }

  async getAuctionBids(auctionId: number): Promise<BidEvent[]> {
    const events = await this.contract.queryFilter("BidPlaced");
    const filteredEvents = events.filter(
      (event) =>
        (event as ethers.EventLog).args.auctionId.toString() ===
        auctionId.toString()
    );

    // Get block data for all filtered events
    const eventPromises = filteredEvents.map(async (event) => {
      const block = await event.getBlock();
      return {
        auctionId: (event as ethers.EventLog).args.auctionId.toString(),
        bidder: (event as ethers.EventLog).args.bidder,
        amount: (event as ethers.EventLog).args.amount.toString(),
        timestamp: block.timestamp, // Get timestamp from block data
      };
    });

    return Promise.all(eventPromises);
  }

  onAuctionCreated(callback: (event: any) => void): void {
    this.contract.on("AuctionCreated", callback);
  }

  onBidPlaced(callback: (event: any) => void): void {
    this.contract.on("BidPlaced", callback);
  }

  onAuctionEnded(callback: (event: any) => void): void {
    this.contract.on("AuctionEnded", callback);
  }
}
