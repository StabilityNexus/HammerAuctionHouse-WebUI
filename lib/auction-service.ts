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
}

// Union type for all auction parameters
export type AuctionParams = 
  | EnglishAuctionParams
  | AllPayAuctionParams 
  | DutchAuctionParams
  | VickreyAuctionParams;

// Auction contract addresses
export const AUCTION_CONTRACTS: Record<AuctionType, Address> = {
  English: "0x30562E1d406FF878e1ceCbDe12322f971F916a7E",
  AllPay: "0x4E3a05c4F5A53b7977CCaD23Ccd7Dc617FE79CA6",
  Exponential: "0xA093851ad8c014d6301B1dC28E81B5458E7CbbB0", 
  Linear: "0xA6BD412DaeE7367F21c5eD36883b5731FD351B8B", 
  Logarithmic: "0x205718CC1D6279aecB410e9E2FAA841ddc60c2fD",
  Vickrey: "0x56587c523FdAeE847463F93D58Cfd2e8023dee54",
};

// Abstract auction service interface
export interface IAuctionService {
  contractAddress: Address;
  createAuction(writeContract: any, params: any): Promise<void>;
  placeBid(writeContract: any, auctionId: bigint, bidAmount: bigint, tokenAddress: Address, auctionType: bigint): Promise<void>;
  withdrawFunds(writeContract: any, auctionId: bigint): Promise<void>;
  withdrawItem(writeContract: any, auctionId: bigint): Promise<void>;
  getAuction(auctionId: bigint,client: any): Promise<any>;
  getAllAuctions(client: any, startBlock: bigint, endBlock: bigint): Promise<any[]>;
  getBidHistory(client: any, auctionId: bigint, startBlock: bigint, endBlock: bigint): Promise<Bid[]>;
  
  // New counter-based methods
  getAuctionCounter(): Promise<bigint>;
  getLastNAuctions(n?: number): Promise<any[]>;
  
  // Dutch auction specific methods
  getCurrentPrice?(auctionId: bigint): Promise<bigint>;
}

// Factory function to get the appropriate auction service
export function getAuctionService(auctionType: AuctionType): IAuctionService {
  switch (auctionType) {
    case "AllPay":
      return getAllPayAuctionService();
    case "English":
      return getEnglishAuctionService();
    case "Linear":
      return getLinearDutchAuctionService();
    case "Exponential":
      return getExponentialDutchAuctionService();
    case "Logarithmic":
      return getLogarithmicDutchAuctionService();
    case "Vickrey":
      return getVickreyAuctionService();
    default:
      throw new Error(`Unsupported auction type: ${auctionType}`);
  }
}

// Lazy imports to avoid circular dependencies
function getAllPayAuctionService(): IAuctionService {
  const { AllPayAuctionService } = require("./services/allpay-auction-service");
  return new AllPayAuctionService();
}

function getEnglishAuctionService(): IAuctionService {
  const { EnglishAuctionService } = require("./services/english-auction-service");
  return new EnglishAuctionService();
}

function getLinearDutchAuctionService(): IAuctionService {
  const { LinearDutchAuctionService } = require("./services/linear-dutch-auction-service");
  return new LinearDutchAuctionService();
}

function getExponentialDutchAuctionService(): IAuctionService {
  const { ExponentialDutchAuctionService } = require("./services/exponential-dutch-auction-service");
  return new ExponentialDutchAuctionService();
}

function getLogarithmicDutchAuctionService(): IAuctionService {
  const { LogarithmicDutchAuctionService } = require("./services/logarithmic-dutch-auction-service");
  return new LogarithmicDutchAuctionService();
}

function getVickreyAuctionService(): IAuctionService {
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
