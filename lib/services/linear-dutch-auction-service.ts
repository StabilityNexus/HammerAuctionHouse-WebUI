import { Address, erc20Abi, erc721Abi, parseEther } from "viem";
import { readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { IAuctionService, DutchAuctionParams, getTokenName } from "../auction-service";
import { Bid } from "../mock-data";
import { generateCode } from "../storage";
import { AUCTION_CONTRACTS, LINEAR_DUTCH_ABI } from "../contract-data";

export class LinearDutchAuctionService implements IAuctionService {
  contractAddress: Address = AUCTION_CONTRACTS.Linear as `0x${string}`;

  private async mapAuctionData(auctionData: any, client: any): Promise<any> {
    if (!auctionData || !Array.isArray(auctionData) || auctionData.length < 16) {
      console.warn("Invalid auction data:", auctionData);
      return null;
    }

    let auctionedTokenName = "";
    let biddingTokenName = "";
    if (client) {
      auctionedTokenName = await getTokenName(client,auctionData[6]);
      biddingTokenName = await getTokenName(client,auctionData[8]);
    }

    return {
      protocol: "Linear",
      id: generateCode("Linear", String(auctionData[0])),
      name: auctionData[1],
      description: auctionData[2],
      imgUrl: auctionData[3],
      auctioneer: auctionData[4],
      auctionType: auctionData[5],
      auctionedToken: auctionData[6],
      auctionedTokenIdOrAmount: auctionData[7],
      biddingToken: auctionData[8],
      startingPrice: auctionData[9],
      availableFunds: auctionData[10],
      reservedPrice: auctionData[11],
      winner: auctionData[12],
      deadline: auctionData[13],
      duration: auctionData[14],
      isClaimed: auctionData[15],
      //Placeholders
      currentPrice: BigInt(0),
      higheshtBid: BigInt(0),
      auctionedTokenName: auctionedTokenName,
      biddingTokenName: biddingTokenName
    };
  }

  async getAuctionCounter(): Promise<bigint> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: LINEAR_DUTCH_ABI,
            functionName: 'auctionCounter'
          }
        ]
      });
      return data[0].result as bigint;
    } catch (error) {
      console.error("Error fetching auction counter:", error);
      throw error;
    }
  }

  async getLastNAuctions(n: number = 10, client?: any): Promise<any[]> {
    try {
      const counter = await this.getAuctionCounter();
      if (counter === BigInt(0)) return [];
      const start = counter > BigInt(n) ? counter - BigInt(n) : BigInt(0);
      const end = counter;
      const contracts = [];
      for (let i = start; i < end; i++) {
        contracts.push({
          address: this.contractAddress,
          abi: LINEAR_DUTCH_ABI,
          functionName: 'auctions',
          args: [i]
        });
      }
      const results = await readContracts(wagmi_config, { contracts });
      const mappedAuctions = Promise.all(results
        .filter((result: any) => !result.error && result.result)
        .map(async (result: any) => await this.mapAuctionData(result.result, client))
        .filter((auction: any) => auction !== null) // Remove null entries
        .reverse()); // Show newest first
      return mappedAuctions;
    } catch (error) {
      console.error("Error fetching last N auctions:", error);
      throw error;
    }
  }

  async getCurrentPrice(auctionId: bigint): Promise<bigint> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: LINEAR_DUTCH_ABI,
            functionName: 'getCurrentPrice',
            args: [auctionId]
          }
        ]
      });
      if (data[0].error) {
        throw new Error('Failed to get current price from contract');
      }
      return data[0].result as bigint;
    } catch (error) {
      console.error("Error fetching current price:", error);
      throw error;
    }
  }

  async createAuction(writeContract: any, params: DutchAuctionParams): Promise<void> {
    try {
      await this.approveToken(
        writeContract,
        params.auctionedToken,
        this.contractAddress,
        (params.auctionType === BigInt(0) ? params.auctionedTokenIdOrAmount : parseEther(String(params.auctionedTokenIdOrAmount))),
        params.auctionType === BigInt(0) // 0 = NFT, 1 = ERC20
      );
      await writeContract({
        address: this.contractAddress,
        abi: LINEAR_DUTCH_ABI,
        functionName: "createAuction",
        args: [
          params.name,
          params.description,
          params.imgUrl,
          Number(params.auctionType),
          params.auctionedToken,
          (params.auctionType === BigInt(0) ? params.auctionedTokenIdOrAmount : parseEther(String(params.auctionedTokenIdOrAmount))),
          params.biddingToken,
          params.startingPrice,
          params.reservedPrice,
          Number(params.duration)
        ],
      });
    } catch (error) {
      console.error("Error creating Linear Dutch auction:", error);
      throw error;
    }
  }

  // In Linear Dutch Auction, there's no placeBid - buyers directly purchase at current price
  async placeBid(
    writeContract: any,
    auctionId: bigint,
    bidAmount: bigint,
    tokenAddress: Address,
    auctionType: bigint
  ): Promise<void> {
    throw new Error("Linear Dutch auction does not support bidding - use withdrawItem to purchase at current price");
  }

  async withdrawFunds(writeContract: any, auctionId: bigint): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: LINEAR_DUTCH_ABI,
        functionName: "withdrawFunds",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      throw error;
    }
  }

  async withdrawItem(writeContract: any, auctionId: bigint, biddingToken: string): Promise<void> {
    try {
      const currentPrice = await this.getCurrentPrice(auctionId);
      await this.approveToken(
        writeContract,
        biddingToken as `0x${string}`,
        this.contractAddress,
        currentPrice,
        false
      );
      await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: LINEAR_DUTCH_ABI,
        functionName: "withdrawItem",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing item:", error);
      throw error;
    }
  }

  private async approveToken(writeContract: any, tokenAddress: Address, spender: Address, amount: bigint, isNFT: boolean): Promise<void> {
    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: isNFT ? erc721Abi : erc20Abi,
        functionName: "approve",
        args: [spender, amount]
      });
    } catch (error) {
      console.error("Error approving token:", error);
      throw error;
    }
  }

  async getAuction(auctionId: bigint, client?: any): Promise<any> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: LINEAR_DUTCH_ABI,
            functionName: 'auctions',
            args: [auctionId]
          }
        ]
      });
      const auctionData = data[0].result;
      const mappedAuction = await this.mapAuctionData(auctionData, client);
      if (!mappedAuction) {
        throw new Error(`Invalid auction data for ID ${auctionId}`);
      }
      return mappedAuction;
    } catch (error) {
      console.error("Error fetching auction data:", error);
      throw error;
    }
  }

  async getAllAuctions(client: any, startBlock: bigint, endBlock: bigint): Promise<any[]> {
    try {
      const auctions = await this.getLastNAuctions(50, client); // Get last 50 auctions
      return auctions;
    } catch (error) {
      console.error("Error fetching all auctions:", error);
      throw error;
    }
  }

  async getBidHistory(
    client: any,
    auctionId: bigint,
    startBlock: bigint,
    endBlock: bigint
  ): Promise<Bid[]> {
    return [];
  }

  async getIndexedAuctions(client: any,start: bigint,end: bigint): Promise<any[]>{
      try{
        const counter = await this.getAuctionCounter();
        if (counter === BigInt(0)) {
          console.log("No auctions found - counter is 0");
          return [];
        }
        if(start < counter){
          return [];
        }
        end = end > counter ? counter : end;
        const contracts = [];
        for (let i = start; i < end; i++) {
          contracts.push({
            address: this.contractAddress,
            abi: LINEAR_DUTCH_ABI,
            functionName: 'auctions',
            args: [i]
          });
        }
        const results = await readContracts(wagmi_config, { contracts });
        const mappedAuctions = await Promise.all(
          results
            .filter((result: any) => !result.error && result.result)
            .map(async (result: any) => await this.mapAuctionData(client, result.result))
            .filter((auction: any) => auction !== null)
            .reverse()
        );
        return mappedAuctions;
      }catch(error){
        console.error("Error fetching indexed auctions:", error);
        throw error;
      }
    }
}
