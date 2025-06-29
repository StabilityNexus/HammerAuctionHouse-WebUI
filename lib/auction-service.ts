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
  English: "0x34a084157dC3f3F1B23000b4F677f3f054681B98",
  AllPay: "0x6e9EFdB9943261C9cc0dCe6fa67769ABF513DE27",
  Exponential: "0xB3F916c2f40aeF1Ed158E5fc99CE402a0a871311", 
  Linear: "0x83a7c45b47a1909dA8BD7CBB7Be4326c56BAF090", 
  Logarithmic: "0x9C9E785501d6A9EEdA181c52653d7729E5E5d7DE",
  Vickrey: "0x1e2f03A962759C02c18201B0d1D7d4524692c096",
};

// Abstract auction service interface
export interface IAuctionService {
  contractAddress: Address;
  createAuction(writeContract: any, params: any): Promise<void>;
  placeBid(writeContract: any, auctionId: bigint, bidAmount: bigint, tokenAddress: Address, auctionType: bigint): Promise<void>;
  withdrawFunds(writeContract: any, auctionId: bigint): Promise<void>;
  withdrawItem(writeContract: any, auctionId: bigint): Promise<void>;
  getAuction(auctionId: bigint): Promise<any>;
  getBidders(client: any, auctionId: bigint, startBlock: bigint, endBlock: bigint): Promise<any[]>;
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
