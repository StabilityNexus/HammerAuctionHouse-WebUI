import { Address, erc20Abi, erc721Abi, formatEther, parseAbiItem } from "viem";
import { Config, readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { IAuctionService, AllPayAuctionParams, getTokenName, mappedData } from "../auction-service";
import { Auction, Bid } from "../mock-data";
import { parseEther } from "ethers";
import { generateCode } from "../storage";
import { ALLPAY_ABI } from "../contract-data";
import { AUCTION_CONTRACTS } from "../contract-data";
import { UsePublicClientReturnType } from "wagmi";
import { WriteContractMutate } from "wagmi/query";

export class AllPayAuctionService implements IAuctionService {
  contractAddress: Address;

  constructor(chainId: number) {
    this.contractAddress = AUCTION_CONTRACTS[chainId].AllPay as `0x${string}`;
  }

  private async mapAuctionData({ client, auctionData }: mappedData): Promise<Auction | null> {
    if (!auctionData || !Array.isArray(auctionData) || auctionData.length < 17) {
      console.warn("Invalid auction data:", auctionData);
      return null;
    }
    let auctionedTokenName = "";
    let biddingTokenName = "";
    if (client) {
      auctionedTokenName = await getTokenName(client, auctionData[6]);
      biddingTokenName = await getTokenName(client, auctionData[8]);
    }

    return {
      protocol: "AllPay",
      id: generateCode("AllPay", String(auctionData[0])),
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
      isClaimed: auctionData[16] as boolean,
      auctionedTokenName: auctionedTokenName,
      biddingTokenName: biddingTokenName // Add token name
    };
  }

  private async approveToken(
    writeContract: WriteContractMutate<Config, unknown>,
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

  async createAuction(writeContract: WriteContractMutate<Config, unknown>, params: AllPayAuctionParams): Promise<void> {
    try {
      await this.approveToken(
        writeContract,
        params.auctionedToken,
        this.contractAddress,
        (params.auctionType === BigInt(0) ? params.auctionedTokenIdOrAmount : parseEther(String(params.auctionedTokenIdOrAmount))),
        params.auctionType === BigInt(0)
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
          (params.auctionType === BigInt(0) ? params.auctionedTokenIdOrAmount : parseEther(String(params.auctionedTokenIdOrAmount))),
          params.biddingToken,
          params.startingBid,
          params.minBidDelta,
          BigInt(params.duration),
          BigInt(params.deadlineExtension),
        ],
      });
    } catch (error) {
      console.error("Error creating AllPay auction:", error);
      throw error;
    }
  }

  async placeBid(
    writeContract: WriteContractMutate<Config, unknown>,
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

  async withdrawFunds(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint): Promise<void> {
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

  async withdrawItem(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint): Promise<void> {
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

  async getAuction(auctionId: bigint, client?: UsePublicClientReturnType): Promise<Auction> {
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
      const mappedAuction = await this.mapAuctionData({ client: client, auctionData: auctionData });
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

  async getLastNAuctions(client: UsePublicClientReturnType, n: number = 10): Promise<(Auction | null)[]> {
    try {
      const counter = await this.getAuctionCounter();
      if (counter === BigInt(0)) {
        return [];
      }
      const start = counter > BigInt(n) ? counter - BigInt(n) : BigInt(0);
      const end = counter;

      const promises = [];
      for (let i = start; i < end; i++) {
        promises.push(
          this.getAuction(i, client).catch(error => {
            console.warn(`Failed to fetch auction ${i}:`, error);
            return null;
          })
        );
      }

      const results = await Promise.all(promises);
      return results.filter((auction): auction is Auction => auction !== null).reverse();
    } catch (err) {
      console.error("Error fetching last N auctions:", err);
      throw err;
    }
  }

  async getCurrentBid(client: UsePublicClientReturnType, auctionId: bigint, userAddress: Address): Promise<bigint> {
    try {
      if (!client) {
        return BigInt(0);
      }
      const result = await client.readContract({
        address: this.contractAddress,
        abi: ALLPAY_ABI,
        functionName: 'bids',
        args: [auctionId, userAddress]
      })
      return result;
    } catch (error) {
      console.error("Error occured while fetching user's cureent bid: ", error);
      throw error;
    }
  }

  async getBidHistory(
    client: UsePublicClientReturnType,
    auctionId: bigint,
    startBlock: bigint,
    endBlock: bigint
  ): Promise<(Bid | undefined)[]> {
    try {
      if (!client) {
        return [];
      }
      const logs = await client.getLogs({
        address: this.contractAddress,
        event: parseAbiItem(
          'event bidPlaced(uint256 indexed auctionId, address bidder, uint256 bidAmount)'
        ),
        args: { auctionId },
        fromBlock: startBlock,
        toBlock: endBlock,
      });
      const bids = await Promise.all(logs.map(async (log, index: number) => {
        const block = await client.getBlock({ blockNumber: log.blockNumber });
        if (log.args.bidAmount === undefined || log.args.bidder === undefined) {
          return; // Skip logs without bidAmount or bidder
        }
        return {
          id: `${auctionId}-${index}`,
          auctionId: auctionId.toString(),
          bidder: log.args.bidder.toString(),
          amount: Number(Number(formatEther(log.args.bidAmount)).toFixed(4)),
          timestamp: Number(block.timestamp) * 1e3
        };
      }));
      return bids;
    } catch (error) {
      console.error("Error fetching bid history:", error);
      throw error;
    }
  }
}
