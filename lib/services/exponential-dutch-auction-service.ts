import { Address, erc20Abi, erc721Abi, parseEther } from "viem";
import { Config, readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { IAuctionService, DutchAuctionParams, getTokenName, mappedData } from "../auction-service";
import { Auction } from "../mock-data";
import { generateCode } from "../storage";
import { AUCTION_CONTRACTS, EXPONENTIAL_DUTCH_ABI } from "../contract-data";
import { UsePublicClientReturnType } from "wagmi";
import { WriteContractMutate } from "wagmi/query";

export interface ExponentialDutchAuctionParams extends DutchAuctionParams {
  decayFactor: bigint; // Exponential decay factor (scaled by 10^5)
}

export class ExponentialDutchAuctionService implements IAuctionService {
  contractAddress: Address = AUCTION_CONTRACTS.Exponential as `0x${string}`;

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
      protocol: "Exponential",
      id: generateCode("Exponential", String(auctionData[0])),
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
      decayFactor: auctionData[12],
      winner: auctionData[13],
      deadline: auctionData[14],
      duration: auctionData[15],
      isClaimed: auctionData[16],
      currentPrice: BigInt(0),
      highestBid: BigInt(0),
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
            abi: EXPONENTIAL_DUTCH_ABI,
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
            abi: EXPONENTIAL_DUTCH_ABI,
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

  async createAuction(writeContract: WriteContractMutate<Config, unknown>, params: ExponentialDutchAuctionParams): Promise<void> {
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
        abi: EXPONENTIAL_DUTCH_ABI,
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
          params.decayFactor,
          BigInt(params.duration)
        ],
      });
    } catch (error) {
      console.error("Error creating Exponential Dutch auction:", error);
      throw error;
    }
  }

  async withdrawFunds(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: EXPONENTIAL_DUTCH_ABI,
        functionName: "withdrawFunds",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      throw error;
    }
  }
  async withdrawItem(writeContract: WriteContractMutate<Config, unknown>, auctionId: bigint, biddingToken: string): Promise<void> {
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
        abi: EXPONENTIAL_DUTCH_ABI,
        functionName: "withdrawItem",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing item:", error);
      throw error;
    }
  }

  private async approveToken(writeContract: WriteContractMutate<Config, unknown>, tokenAddress: Address, spender: Address, amount: bigint, isNFT: boolean): Promise<void> {
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

  async getAuction(auctionId: bigint, client: UsePublicClientReturnType): Promise<Auction> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: EXPONENTIAL_DUTCH_ABI,
            functionName: 'auctions',
            args: [auctionId]
          }
        ]
      });
      const auctionData = data[0].result;
      const mappedAuction = await this.mapAuctionData({client, auctionData});
      if (!mappedAuction) {
        throw new Error(`Invalid auction data for ID ${auctionId}`);
      }
      return mappedAuction;
    } catch (error) {
      console.error("Error fetching auction data:", error);
      throw error;
    }
  }

}
