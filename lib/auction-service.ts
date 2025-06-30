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
  getAuction(auctionId: bigint): Promise<any>;
  getAllAuctions(client: any, startBlock: bigint, endBlock: bigint): Promise<any[]>;
  getBidHistory(client: any, auctionId: bigint, startBlock: bigint, endBlock: bigint): Promise<Bid[]>;
  
  // New counter-based methods
  getAuctionCounter(): Promise<bigint>;
  getLastNAuctions(n?: number): Promise<any[]>;
  
  // Dutch auction specific methods
  getCurrentPrice?(auctionId: bigint): Promise<bigint>;
}

/**
 * Returns an auction service instance corresponding to the specified auction type.
 *
 * @param auctionType - The type of auction protocol to use
 * @returns An implementation of the auction service interface for the given auction type
 * @throws Error if the auction type is unsupported
 */
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

/**
 * Returns an instance of the AllPay auction service.
 *
 * Lazily imports the AllPay auction service implementation to prevent circular dependencies.
 * @returns An IAuctionService implementation for AllPay auctions.
 */
function getAllPayAuctionService(): IAuctionService {
  const { AllPayAuctionService } = require("./services/allpay-auction-service");
  return new AllPayAuctionService();
}

/**
 * Lazily instantiates and returns the English auction service implementation.
 *
 * This function dynamically imports the English auction service to avoid circular dependencies.
 * @returns An instance of the English auction service.
 */
function getEnglishAuctionService(): IAuctionService {
  const { EnglishAuctionService } = require("./services/english-auction-service");
  return new EnglishAuctionService();
}

/**
 * Returns an instance of the linear Dutch auction service.
 *
 * Lazily imports and instantiates the service to avoid circular dependencies.
 * @returns The linear Dutch auction service implementation.
 */
function getLinearDutchAuctionService(): IAuctionService {
  const { LinearDutchAuctionService } = require("./services/linear-dutch-auction-service");
  return new LinearDutchAuctionService();
}

/**
 * Lazily imports and returns an instance of the exponential Dutch auction service.
 *
 * This function avoids circular dependencies by requiring the service module at runtime.
 * @returns An instance of the exponential Dutch auction service implementing IAuctionService.
 */
function getExponentialDutchAuctionService(): IAuctionService {
  const { ExponentialDutchAuctionService } = require("./services/exponential-dutch-auction-service");
  return new ExponentialDutchAuctionService();
}

/**
 * Returns an instance of the Logarithmic Dutch auction service.
 *
 * Lazily imports and instantiates the service to avoid circular dependencies.
 * @returns The Logarithmic Dutch auction service implementation.
 */
function getLogarithmicDutchAuctionService(): IAuctionService {
  const { LogarithmicDutchAuctionService } = require("./services/logarithmic-dutch-auction-service");
  return new LogarithmicDutchAuctionService();
}

/**
 * Lazily imports and returns an instance of the Vickrey auction service.
 *
 * This function avoids circular dependencies by requiring the Vickrey auction service module at runtime.
 *
 * @returns An instance of the Vickrey auction service implementing the IAuctionService interface.
 */
function getVickreyAuctionService(): IAuctionService {
  const { VickreyAuctionService } = require("./services/vickrey-auction-service");
  return new VickreyAuctionService();
}

/**
 * Converts a bid amount from wei to a string in ether units with 4 decimal places.
 *
 * @param amount - The bid amount in wei
 * @returns The formatted bid amount as a string in ether units
 */
export function formatBidAmount(amount: bigint): string {
  return (Number(amount) / 1e18).toFixed(4);
}

/**
 * Converts a bid amount from a string in ether units to a bigint in wei.
 *
 * @param amount - The bid amount as a string in ether units (e.g., "1.2345")
 * @returns The equivalent bid amount as a bigint in wei (1 ether = 1e18 wei)
 */
export function parseBidAmount(amount: string): bigint {
  return BigInt(Math.floor(parseFloat(amount) * 1e18));
}

/**
 * Determines whether an auction is currently active.
 *
 * An auction is considered active if the current time is before its deadline and it has not been claimed.
 *
 * @returns True if the auction is active; otherwise, false.
 */
export function isAuctionActive(auction: Auction): boolean {
  const now = BigInt(Date.now());
  return now < auction.deadline && !auction.isClaimed;
}

/**
 * Determines whether an auction has ended based on the current time and the auction's deadline.
 *
 * @returns True if the current time is on or after the auction deadline; otherwise, false.
 */
export function isAuctionEnded(auction: Auction): boolean {
  const now = BigInt(Date.now());
  return now >= auction.deadline;
}
