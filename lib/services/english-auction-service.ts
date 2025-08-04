import { Address, erc20Abi, erc721Abi, parseAbiItem } from "viem";
import { readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { IAuctionService, EnglishAuctionParams } from "../auction-service";
import { Bid } from "../mock-data";
import { parseEther } from "ethers";
import { generateCode } from "../storage";
import { getTokenName } from "../auction-service";
import { AUCTION_CONTRACTS, ENGLISH_ABI } from "../contract-data";

export class EnglishAuctionService implements IAuctionService {
  contractAddress: Address = AUCTION_CONTRACTS.English as `0x${string}`;
  async getAuctionCounter(): Promise<bigint> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: ENGLISH_ABI,
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

  async getLastNAuctions(client?:any,n: number = 10): Promise<any[]> {
    try {
      const counter = await this.getAuctionCounter();
      if (counter === BigInt(0)) {
        return [];
      }
      const start = counter > BigInt(n) ? counter - BigInt(n) : BigInt(0);
      const end = counter;
      const contracts = [];
      for (let i = start; i < end; i++) {
        contracts.push({
          address: this.contractAddress,
          abi: ENGLISH_ABI,
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
    } catch (error) {
      console.error("Error fetching last N auctions:", error);
      throw error;
    }
  }

  private async approveToken(
    writeContract: any,
    tokenAddress: Address,
    spender: Address,
    amountOrId: bigint,
    isNFT: boolean
  ): Promise<void> {
    try {
      if (isNFT) {
        await writeContract({
          address: tokenAddress,
          abi: erc721Abi,
          functionName: "approve",
          args: [spender, amountOrId],
        });
      } else {
        await writeContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [spender, amountOrId],
        });
      }
    } catch (error) {
      console.error("Error approving token:", error);
      throw error;
    }
  }

  async createAuction(writeContract: any, params: EnglishAuctionParams): Promise<void> {
    try {
      await this.approveToken(
        writeContract,
        params.auctionedToken,
        this.contractAddress,
        (params.auctionType === BigInt(0)?params.auctionedTokenIdOrAmount:parseEther(String(params.auctionedTokenIdOrAmount))),
        params.auctionType === BigInt(0) // 0 = NFT, 1 = ERC20
      );
      await writeContract({
        address: this.contractAddress,
        abi: ENGLISH_ABI,
        functionName: "createAuction",
        args: [
          params.name,
          params.description,
          params.imgUrl,
          Number(params.auctionType),
          params.auctionedToken,
          (params.auctionType === BigInt(0)?params.auctionedTokenIdOrAmount:parseEther(String(params.auctionedTokenIdOrAmount))),
          params.biddingToken,
          params.startingBid,
          params.minBidDelta,
          Number(params.duration),
          Number(params.deadlineExtension),
        ],
      });
    } catch (error) {
      console.error("Error creating English auction:", error);
      throw error;
    }
  }

  async placeBid(
    writeContract: any,
    auctionId: bigint,
    bidAmount: bigint,
    biddingTokenAddress: Address,
  ): Promise<void> {
    try {
      await this.approveToken(
        writeContract,
        biddingTokenAddress,
        this.contractAddress,
        bidAmount,
        false // 0 = NFT, 1 = ERC20
      )
      writeContract({
        address: this.contractAddress,
        abi: ENGLISH_ABI,
        functionName: "placeBid",
        args: [auctionId, bidAmount],
      });
    } catch (error) {
      console.error("Error placing English bid:", error);
      throw error;
    }
  }

  async withdrawFunds(writeContract: any, auctionId: bigint): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress,
        abi: ENGLISH_ABI,
        functionName: "withdrawFunds",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      throw error;
    }
  }

  async withdrawItem(writeContract: any, auctionId: bigint): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress,
        abi: ENGLISH_ABI,
        functionName: "withdrawItem",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing item:", error);
      throw error;
    }
  }

  async getAuction(auctionId: bigint, publicClient?: any): Promise<any> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: ENGLISH_ABI,
            functionName: 'auctions',
            args: [auctionId]
          }
        ]
      });
      const auctionData = data[0].result;
      const mappedAuction = await this.mapAuctionData(auctionData, publicClient);
      if (!mappedAuction) {
        throw new Error(`Invalid auction data for ID ${auctionId}`);
      }
      return mappedAuction;
    } catch (error) {
      console.error("Error fetching auction data:", error);
      throw error;
    }
  }

  private async mapAuctionData(client: any,auctionData: any): Promise<any> {
    if (!auctionData || !Array.isArray(auctionData) || auctionData.length < 17) {
      console.warn("Invalid auction data:", auctionData);
      return null;
    }

    let auctionedTokenName = "Unknown Token";
    let biddingTokenName = "Unknown Token";
    
    if (client) {
      try {
        auctionedTokenName = await getTokenName(client, auctionData[6]);
        biddingTokenName = await getTokenName(client, auctionData[8]);
      } catch (error) {
        console.warn("Error fetching token names:", error);
      }
    }

    return {
      protocol: "English",
      id: generateCode("English", String(auctionData[0])),
      name: auctionData[1],
      description: auctionData[2],
      imgUrl: auctionData[3],
      auctioneer: auctionData[4],
      auctionType: auctionData[5],
      auctionedToken: auctionData[6],
      auctionedTokenIdOrAmount: auctionData[7],
      biddingToken: auctionData[8],
      startingBid: auctionData[9],
      availableFunds: auctionData[10],
      minBidDelta: auctionData[11],
      highestBid: auctionData[12],
      winner: auctionData[13],
      deadline: auctionData[14],
      deadlineExtension: auctionData[15],
      isClaimed: auctionData[16],
      auctionedTokenName: auctionedTokenName,
      biddingTokenName: biddingTokenName,
      // Vickrey placeholders
      bidCommitEnd: BigInt(0),
      bidRevealEnd: BigInt(0),
      winningBid: BigInt(0),
    };
  }

  async getBidHistory(
    client: any,
    auctionId: bigint,
    startBlock: bigint,
    endBlock: bigint
  ): Promise<Bid[]> {
    try {
      const logs = await client.getLogs({
        address: this.contractAddress,
        event: parseAbiItem(
          'event bidPlaced(uint256 indexed auctionId, address bidder, uint256 bidAmount)'
        ),
        args: { auctionId },
        fromBlock: startBlock,
        toBlock: endBlock,
      });
      const bids = await Promise.all(logs.map(async (log: any, index: number) => {
        const block = await client.getBlock({ blockNumber: log.blockNumber });
        return {
          id: `${auctionId}-${index}`,
          auctionId: auctionId.toString(),
          bidder: log.args.bidder,
          amount: Number(log.args.bidAmount) / 1e18, 
          timestamp: Number(block.timestamp)*1e3
        };
      }));
      return bids;
    } catch (error) {
      console.error("Error fetching bid history:", error);
      throw error;
    }
  }

  async getUserBidAmount(auctionId: bigint, userAddress: Address): Promise<bigint> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: ENGLISH_ABI,
            functionName: 'bids',
            args: [auctionId, userAddress]
          }
        ]
      });
      return data[0].result as bigint;
    } catch (error) {
      console.error("Error fetching user bid amount:", error);
      throw error;
    }
  }

  async getCurrentBid(client: any,auctionId: bigint,userAddress: Address): Promise<any>{
      try {
        const result = await client.readContract({
          address: this.contractAddress,
          abi: ENGLISH_ABI,
          functionName: 'bids',
          args: [auctionId,userAddress]
        })
        return result;
      } catch (error) {
        console.error("Error occured while fetching user's cureent bid: ",error);
        throw error;
      }
    }
//TODO: For Pagination
  async getIndexedAuctions(client: any,start: bigint,end: bigint): Promise<any[]>{
      try{
        const counter = await this.getAuctionCounter();
        if (counter === BigInt(0)) {
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
            abi: ENGLISH_ABI,
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
