import { Address, erc20Abi, erc721Abi, keccak256, encodePacked, parseEther, parseAbiItem } from "viem";
import { Config, readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { getTokenName, IAuctionService, mappedData, VickreyAuctionParams } from "../auction-service";
import { Auction, Bid } from "../types";
import { generateCode } from "../storage";
import { AUCTION_CONTRACTS, VICKREY_ABI } from "../contract-data";
import { WriteContractMutate } from "wagmi/query";
import { UsePublicClientReturnType } from "wagmi";

export class VickreyAuctionService implements IAuctionService {
  contractAddress: Address;
  constructor(chainId: number) {
    this.contractAddress = AUCTION_CONTRACTS[chainId].Vickrey as `0x${string}`;
  }

  private async mapAuctionData({ client, auctionData }: mappedData): Promise<Auction | null> {
    if (!auctionData || !Array.isArray(auctionData) || auctionData.length < 16) {
      console.warn("Invalid Vickrey auction data:", auctionData, "Expected 16 fields, got:", auctionData?.length);
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
      protocol: "Vickrey",
      id: generateCode("Vickrey", String(auctionData[0])),
      name: auctionData[1],
      description: auctionData[2],
      imgUrl: auctionData[3],
      auctioneer: auctionData[4],
      auctionType: auctionData[5],
      auctionedToken: auctionData[6],
      auctionedTokenIdOrAmount: auctionData[7],
      biddingToken: auctionData[8],
      availableFunds: auctionData[9],
      winningBid: auctionData[10],
      winner: auctionData[11],
      startTime: auctionData[12],
      bidCommitEnd: auctionData[13],
      bidRevealEnd: auctionData[14],
      isClaimed: auctionData[15],
      auctionedTokenName: auctionedTokenName,
      biddingTokenName: biddingTokenName,
      //Placeholders
      startingBid: BigInt(0),
      minBidDelta: BigInt(0),
      highestBid: BigInt(0),
      deadline: auctionData[14],
      deadlineExtension: BigInt(0),
      commitFee: auctionData[16],
      accumulatedCommitFee: auctionData[18],
      protocolFee: auctionData[17]
    };
  }

  static generateCommitment(bidAmount: bigint, salt: string): `0x${string}` {
    const saltBytes = keccak256(encodePacked(['string'], [salt]));
    return keccak256(encodePacked(['uint256', 'bytes32'], [bidAmount, saltBytes]));
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

  async getAuctionCounter(): Promise<bigint> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: VICKREY_ABI,
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
      if (counter === BigInt(0)) return [];
      const start = counter > BigInt(n) ? counter - BigInt(n) + BigInt(0) : BigInt(0);
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
    } catch (error) {
      console.error("Error fetching last N Vickrey auctions:", error);
      throw error;
    }
  }

  async createAuction(writeContract: WriteContractMutate<Config, unknown>, params: VickreyAuctionParams): Promise<void> {
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
        abi: VICKREY_ABI,
        functionName: "createAuction",
        args: [
          params.name,
          params.description,
          params.imgUrl,
          Number(params.auctionType),
          params.auctionedToken,
          (params.auctionType === BigInt(0) ? params.auctionedTokenIdOrAmount : parseEther(String(params.auctionedTokenIdOrAmount))),
          params.biddingToken,
          parseEther(String(params.minBid)), // Use the parsed minBid value
          BigInt(params.bidCommitDuration),
          BigInt(params.bidRevealDuration),
          BigInt(params.commitFee)
        ],
      });
    } catch (error) {
      console.error("Error creating Vickrey auction:", error);
      throw error;
    }
  }

  async commitBid(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint, commitment: `0x${string}`): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress,
        abi: VICKREY_ABI,
        functionName: "commitBid",
        args: [auctionId, commitment],
        value: BigInt("1000000000000000"), // 0.001 ETH commit fee
      });
    } catch (error) {
      console.error("Error committing bid:", error);
      throw error;
    }
  }

  async revealBid(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint, bidAmount: bigint, salt: string): Promise<void> {
    try {
      const biddingToken = (await this.getAuction(auctionId)).biddingToken
      const saltBytes = keccak256(encodePacked(['string'], [salt]));
      await this.approveToken(
        writeContract,
        biddingToken as `0x${string}`,
        this.contractAddress,
        bidAmount,
        false
      )
      await writeContract({
        address: this.contractAddress,
        abi: VICKREY_ABI,
        functionName: "revealBid",
        args: [auctionId, bidAmount, saltBytes],
      });
    } catch (error) {
      console.error("Error revealing bid:", error);
      throw error;
    }
  }

  async withdraw(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress,
        abi: VICKREY_ABI,
        functionName: "withdraw",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      throw error;
    }
  }

  async claim(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress,
        abi: VICKREY_ABI,
        functionName: "claim",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing item:", error);
      throw error;
    }
  }

  async getAuction(auctionId: bigint, publicClient?: UsePublicClientReturnType): Promise<Auction> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: VICKREY_ABI,
            functionName: 'auctions',
            args: [auctionId]
          }
        ]
      });
      const auctionData = data[0].result;
      const mappedAuction = await this.mapAuctionData({ client: publicClient, auctionData: auctionData });
      if (!mappedAuction) {
        throw new Error(`Invalid Vickrey auction data for ID ${auctionId}`);
      }
      return mappedAuction;
    } catch (error) {
      console.error("Error fetching Vickrey auction data:", error);
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
          'event BidRevealed(uint256 indexed auctionId, address indexed bidder, uint256 bidAmount)'
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
          bidder: log.args.bidder,
          amount: Number(log.args.bidAmount) / 1e18,
          timestamp: Number(block.timestamp) * 1e3
        };
      }));
      return bids;
    } catch (error) {
      console.error("Error fetching bid history:", error);
      throw error;
    }
  }

  async getUserCommitment(auctionId: bigint, userAddress: Address): Promise<string> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: VICKREY_ABI,
            functionName: 'commitments',
            args: [auctionId, userAddress]
          }
        ]
      });
      return data[0].result as string;
    } catch (error) {
      console.error("Error fetching user commitment:", error);
      return "0x0000000000000000000000000000000000000000000000000000000000000000";
    }
  }

  async getUserBid(auctionId: bigint, userAddress: Address): Promise<bigint> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: VICKREY_ABI,
            functionName: 'bids',
            args: [auctionId, userAddress]
          }
        ]
      });
      return data[0].result as bigint;
    } catch (error) {
      console.error("Error fetching user bid:", error);
      return BigInt(0);
    }
  }

}
