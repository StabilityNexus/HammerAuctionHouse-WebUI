// Auction Service - Unified API for all auction protocols
import { Address } from "viem";
import { AuctionType, Auction, Bid } from "./mock-data";

// Base interfaces for all auction types
export interface BaseAuctionParams {
  name: string;
  description: string;
  imgUrl: string;
  auctionType: bigint; // 0 = NFT, 1 = ERC20
  auctionedToken: Address;
  auctionedTokenIdOrAmount: bigint;
  biddingToken: Address;
}

export interface EnglishAuctionParams extends BaseAuctionParams {
  startingBid: bigint;
  minBidDelta: bigint;
  duration: bigint;
  deadlineExtension: bigint;
}

export interface AllPayAuctionParams extends BaseAuctionParams {
  startingBid: bigint;
  minBidDelta: bigint;
  duration: bigint;
  deadlineExtension: bigint;
}

export interface DutchAuctionParams extends BaseAuctionParams {
  startingPrice: bigint;
  reservedPrice: bigint;
  decayFactor?: bigint;
  duration: bigint;
}

export interface VickreyAuctionParams extends BaseAuctionParams {
  bidCommitDuration: bigint;
  bidRevealDuration: bigint;
  minBid: bigint;
}

// Union type for all auction parameters
export type AuctionParams = 
  | EnglishAuctionParams
  | AllPayAuctionParams 
  | DutchAuctionParams
  | VickreyAuctionParams;


// Abstract auction service interface
export interface IAuctionService {
  contractAddress: Address;
  createAuction(writeContract: any, params: any): Promise<void>;
  placeBid(writeContract: any, auctionId: bigint, bidAmount: bigint, tokenAddress: Address, auctionType: bigint): Promise<void>;
  withdrawFunds(writeContract: any, auctionId: bigint): Promise<void>;
  withdrawItem(writeContract: any, auctionId: bigint,biddingToken?: string): Promise<void>;
  getAuction(auctionId: bigint,client: any): Promise<any>;
  getBidHistory(client: any, auctionId: bigint, startBlock: bigint, endBlock: bigint): Promise<Bid[]>;
  
  // New counter-based methods
  getAuctionCounter(): Promise<bigint>;
  getLastNAuctions(client: any,n?: number): Promise<any[]>;
  
  // Dutch auction specific methods
  getCurrentPrice?(auctionId: bigint): Promise<bigint>;

  //Vickrey Auction specific methods
  revealBid?(writeContract: any,auctionId: bigint,bidAmount: bigint,salt: string): Promise<void>;

  //AllPay & English specific methods
  getCurrentBid?(client: any,auctionId: bigint,userAddress: Address): Promise<any>;
}

// Factory function to get the appropriate auction service
export async function getAuctionService(auctionType: AuctionType): Promise<IAuctionService> {
  switch (auctionType) {
    case "AllPay":
      return await getAllPayAuctionService();
    case "English":
      return await getEnglishAuctionService();
    case "Linear":
      return await getLinearDutchAuctionService();
    case "Exponential":
      return await getExponentialDutchAuctionService();
    case "Logarithmic":
      return await getLogarithmicDutchAuctionService();
    case "Vickrey":
      return await getVickreyAuctionService();
    default:
      throw new Error(`Unsupported auction type: ${auctionType}`);
  }
}

// Lazy imports to avoid circular dependencies
async function getAllPayAuctionService(): Promise<IAuctionService> {
  const { AllPayAuctionService } = await import("./services/allpay-auction-service");
  return new AllPayAuctionService();
}

async function getEnglishAuctionService(): Promise<IAuctionService> {
  const { EnglishAuctionService } = await import("./services/english-auction-service");
  return new EnglishAuctionService();
}

async function getLinearDutchAuctionService(): Promise<IAuctionService> {
  const { LinearDutchAuctionService } = require("./services/linear-dutch-auction-service");
  return new LinearDutchAuctionService();
}

async function getExponentialDutchAuctionService(): Promise<IAuctionService> {
  const { ExponentialDutchAuctionService } = require("./services/exponential-dutch-auction-service");
  return new ExponentialDutchAuctionService();
}

async function getLogarithmicDutchAuctionService(): Promise<IAuctionService> {
  const { LogarithmicDutchAuctionService } = require("./services/logarithmic-dutch-auction-service");
  return new LogarithmicDutchAuctionService();
}

async function getVickreyAuctionService(): Promise<IAuctionService> {
  const { VickreyAuctionService } = require("./services/vickrey-auction-service");
  return new VickreyAuctionService();
}

// Utility functions
export function formatBidAmount(amount: bigint): string {
  return (Number(amount) / 1e18).toFixed(4);
}

export function parseBidAmount(amount: string): bigint {
  return BigInt(Math.floor(parseFloat(amount) * 1e18));
}

export function isAuctionActive(auction: Auction): boolean {
  const now = BigInt(Date.now());
  return now < auction.deadline && !auction.isClaimed;
}

export function isAuctionEnded(auction: Auction): boolean {
  const now = BigInt(Date.now());
  return now >= auction.deadline;
}

export async function getTokenName(publicClient: any,auctionedToken: string): Promise<string>{
  const tokenContract = {
    abi: [{
      name: 'symbol',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ type: 'string' }]
    }]
  };

  if(auctionedToken=="0x0000000000000000000000000000000000000000"){
    return 'Unknown';
  }

  try {
    const symbol = await publicClient.readContract({
      address: auctionedToken,
      abi: tokenContract.abi,
      functionName: 'symbol'
    });
    return symbol as string;
  } catch (error) {
    console.error('Error getting token symbol:', error);
    return 'Unknown';
  }
}


