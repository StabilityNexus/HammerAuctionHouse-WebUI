// Auction Service - Unified API for all auction protocols
import { Address, formatEther, parseEther } from "viem";
import { AuctionType, Auction, Bid } from "./types";
import { Config, UsePublicClientReturnType } from "wagmi";
import { WriteContractMutate } from "wagmi/query";

export interface AuctionData {
  name: string;
  description: string;
  imgUrl: string;
  auctionType: bigint; // 0 = NFT, 1 = ERC20
  auctionedToken: Address;
  auctionedTokenIdOrAmount: bigint;
  biddingToken: Address;
  startingBid?: bigint;
  minBidDelta?: bigint;
  duration?: bigint;
  deadlineExtension?: bigint;
  startingPrice?: bigint;
  reservedPrice?: bigint;
  decayFactor?: bigint;
  bidCommitDuration?: bigint;
  bidRevealDuration?: bigint;
  minBid?: bigint;
  protocolFee: bigint;
  commitFee?: bigint;
  accumulatedCommitFee?: bigint;
  settlePrice?: bigint;
}

export interface mappedData {
  client: UsePublicClientReturnType;
  auctionData: readonly (bigint | string | boolean | `0x${string}` | number)[] | undefined;
}

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
  settlePrice?: bigint;
}

export interface VickreyAuctionParams extends BaseAuctionParams {
  bidCommitDuration: bigint;
  bidRevealDuration: bigint;
  minBid: bigint;
  commitFee: bigint;
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
  createAuction(writeContract: WriteContractMutate<Config, unknown>, params: Partial<AuctionParams>): Promise<void>;
  placeBid?(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint, tokenAddress: Address,bidAmount?: bigint): Promise<void>;
  withdraw?(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint): Promise<void>;
  claim(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint, biddingToken?: string): Promise<void>;
  getAuction(auctionId: bigint, client: UsePublicClientReturnType): Promise<Auction>;
  getBidHistory?(client: UsePublicClientReturnType, auctionId: bigint, startBlock: bigint, endBlock: bigint): Promise<(undefined | Bid)[]>;
  getAuctionCounter(): Promise<bigint>;
  getLastNAuctions(client: UsePublicClientReturnType, n?: number): Promise<(Auction | null)[]>;
  getCurrentPrice?(auctionId: bigint): Promise<bigint>;
  revealBid?(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint, bidAmount: bigint, salt: string): Promise<void>;
  getCurrentBid?(client: UsePublicClientReturnType, auctionId: bigint, userAddress: Address): Promise<bigint>;
}

// Factory function to get the appropriate auction service
export async function getAuctionService(auctionType: AuctionType, chainId: number): Promise<IAuctionService> {
  switch (auctionType) {
    case "AllPay":
      return await getAllPayAuctionService(chainId);
    case "English":
      return await getEnglishAuctionService(chainId);
    case "Linear":
      return await getLinearDutchAuctionService(chainId);
    case "Exponential":
      return await getExponentialDutchAuctionService(chainId);
    case "Logarithmic":
      return await getLogarithmicDutchAuctionService(chainId);
    case "Vickrey":
      return await getVickreyAuctionService(chainId);
    default:
      throw new Error(`Unsupported auction type: ${auctionType}`);
  }
}

// Lazy imports to avoid circular dependencies
async function getAllPayAuctionService(chainId: number): Promise<IAuctionService> {
  const { AllPayAuctionService } = await import("./services/allpay-auction-service");
  return new AllPayAuctionService(chainId);
}

async function getEnglishAuctionService(chainId: number): Promise<IAuctionService> {
  const { EnglishAuctionService } = await import("./services/english-auction-service");
  return new EnglishAuctionService(chainId);
}

async function getLinearDutchAuctionService(chainId: number): Promise<IAuctionService> {
  const { LinearDutchAuctionService } = await import("./services/linear-dutch-auction-service");
  return new LinearDutchAuctionService(chainId);
}

async function getExponentialDutchAuctionService(chainId: number): Promise<IAuctionService> {
  const { ExponentialDutchAuctionService } = await import("./services/exponential-dutch-auction-service");
  return new ExponentialDutchAuctionService(chainId);
}

async function getLogarithmicDutchAuctionService(chainId: number): Promise<IAuctionService> {
  const { LogarithmicDutchAuctionService } = await import("./services/logarithmic-dutch-auction-service");
  return new LogarithmicDutchAuctionService(chainId);
}

async function getVickreyAuctionService(chainId: number): Promise<IAuctionService> {
  const { VickreyAuctionService } = await import("./services/vickrey-auction-service");
  return new VickreyAuctionService(chainId);
}

// Utility functions
export function formatBidAmount(amount: bigint): string {
  return formatEther(amount);
}

export function parseBidAmount(amount: string): bigint {
  try {
    return parseEther(amount);
  } catch {
    return BigInt(0);
  }
}

export function isAuctionActive(auction: Auction): boolean {
  const now = BigInt(Date.now());
  return now < auction.deadline && !auction.isClaimed;
}

export function isAuctionEnded(auction: Auction): boolean {
  const now = BigInt(Date.now());
  return now >= auction.deadline;
}

export async function getTokenName(publicClient: UsePublicClientReturnType, auctionedToken: string): Promise<string> {
  const tokenContract = {
    abi: [{
      name: 'symbol',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ type: 'string' }]
    }]
  };

  if (!publicClient) {
    return 'Unknown';
  }
  if (auctionedToken == "0x0000000000000000000000000000000000000000") {
    return 'Unknown';
  }

  try {
    const symbol = await publicClient.readContract({
      address: auctionedToken as Address,
      abi: tokenContract.abi,
      functionName: 'symbol'
    });
    return symbol as string;
  } catch (error) {
    console.error('Error getting token symbol:', error);
    return 'Unknown';
  }
}


