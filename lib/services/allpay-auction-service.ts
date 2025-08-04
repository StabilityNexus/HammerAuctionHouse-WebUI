import { Address, erc20Abi, erc721Abi, formatEther, parseAbiItem } from "viem";
import { readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { IAuctionService, AllPayAuctionParams, getTokenName } from "../auction-service";
import { Bid } from "../mock-data";
import { parseEther } from "ethers";
import { generateCode } from "../storage";
import { ALLPAY_ABI } from "../contract-data";
import { AUCTION_CONTRACTS } from "../contract-data";
import { useReadContract } from "wagmi";

export class AllPayAuctionService implements IAuctionService {
  contractAddress: Address = AUCTION_CONTRACTS.AllPay as `0x${string}`;
  

  private async mapAuctionData(client:any,auctionData: any): Promise<any> {
    if (!auctionData || !Array.isArray(auctionData) || auctionData.length < 17) {
      console.warn("Invalid auction data:", auctionData);
      return null;
    }
    let auctionedTokenName = "";
    let biddingTokenName = "";
    if(client){
      auctionedTokenName = await getTokenName(client, auctionData[6]);
      biddingTokenName = await getTokenName(client, auctionData[8]);
    }

    return {
      protocol: "AllPay",
      id: generateCode("AllPay",String(auctionData[0])),
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
      biddingTokenName: biddingTokenName // Add token name
    };
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

  async createAuction(writeContract: any, params: AllPayAuctionParams): Promise<void> {
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
        abi: ALLPAY_ABI,
        functionName: "createAuction",
        args: [
          params.name,
          params.description,
          params.imgUrl,
          Number(params.auctionType),
          params.auctionedToken,
          (params.auctionType === BigInt(0)?params.auctionedTokenIdOrAmount:parseEther(String(params.auctionedTokenIdOrAmount))), //TODO::not in case of nfts
          params.biddingToken,
          params.startingBid,
          params.minBidDelta,
          Number(params.duration),
          Number(params.deadlineExtension),
        ],
      });
    } catch (error) {
      console.error("Error creating AllPay auction:", error);
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
      );
      writeContract({
        address: this.contractAddress,
        abi: ALLPAY_ABI,
        functionName: "placeBid",
        args: [auctionId, bidAmount],
      });
    } catch (error) {
      console.error("Error placing AllPay bid:", error);
      throw error;
    }
  }

  async withdrawFunds(writeContract: any, auctionId: bigint): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress,
        abi: ALLPAY_ABI,
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
        abi: ALLPAY_ABI,
        functionName: "withdrawItem",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing item:", error);
      throw error;
    }
  }

  async getAuction(auctionId: bigint,client?: any): Promise<any> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: ALLPAY_ABI,
            functionName: 'auctions',
            args: [auctionId]
          }
        ]
      });
      const auctionData = data[0].result;
      const mappedAuction = await this.mapAuctionData(client,auctionData);
      if (!mappedAuction) {
        throw new Error(`Invalid auction data for ID ${auctionId}`);
      }
      return mappedAuction;
    } catch (error) {
      console.error("Error fetching auction data:", error);
      throw error;
    }
  }

  async getAuctionCounter(): Promise<bigint> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: ALLPAY_ABI,
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

  async getLastNAuctions(n: number = 10,client?:any): Promise<any[]> {
    try {
      const counter = await this.getAuctionCounter();
      if (counter === BigInt(0)) {
        console.log("No auctions found - counter is 0");
        return [];
      }
      const start = counter > BigInt(n) ? counter - BigInt(n) : BigInt(0);
      const end = counter;
      const contracts = [];
      for (let i = start; i < end; i++) {
        contracts.push({
          address: this.contractAddress,
          abi: ALLPAY_ABI,
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

  async getCurrentBid(client: any,auctionId: bigint,userAddress: Address): Promise<any>{
    try {
      const result = await client.readContract({
        address: this.contractAddress,
        abi: ALLPAY_ABI,
        functionName: 'bids',
        args: [auctionId,userAddress]
      })
      return result;
    } catch (error) {
      console.log("Error occured while fetching user's cureent bid: ",error);
      throw error;
    }
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
          abi: ALLPAY_ABI,
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

  async getAllAuctions(client: any, startBlock: bigint, endBlock: bigint): Promise<any[]> {
    try {
      const auctions = await this.getLastNAuctions(50,client); // Get last 50 auctions
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
          amount: Number(formatEther(log.args.bidAmount)).toFixed(4), 
          timestamp: Number(block.timestamp)*1e3
        };
      }));
      return bids;
    } catch (error) {
      console.error("Error fetching bid history:", error);
      throw error;
    }
  }
}
