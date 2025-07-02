import { Address, erc20Abi, erc721Abi, parseAbiItem } from "viem";
import { readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { IAuctionService, EnglishAuctionParams } from "../auction-service";
import { Bid } from "../mock-data";
import { parseEther } from "ethers";
import { generateCode } from "../storage";
import { getTokenName } from "../auction-service";

export const ENGLISH_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "Id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "imgUrl",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "auctioneer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Auction.AuctionType",
        "name": "auctionType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "auctionedToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "auctionedTokenIdOrAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "biddingToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startingBid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "minBidDelta",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadlineExtension",
        "type": "uint256"
      }
    ],
    "name": "AuctionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "bidder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bidAmount",
        "type": "uint256"
      }
    ],
    "name": "bidPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountWithdrawn",
        "type": "uint256"
      }
    ],
    "name": "fundsWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "withdrawer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "auctionedTokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "auctionedTokenIdOrAmount",
        "type": "uint256"
      }
    ],
    "name": "itemWithdrawn",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "auctionCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "auctions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "imgUrl",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "auctioneer",
        "type": "address"
      },
      {
        "internalType": "enum Auction.AuctionType",
        "name": "auctionType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "auctionedToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "auctionedTokenIdOrAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "biddingToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startingBid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "availableFunds",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minBidDelta",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "highestBid",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadlineExtension",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isClaimed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "bids",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "imgUrl",
        "type": "string"
      },
      {
        "internalType": "enum Auction.AuctionType",
        "name": "auctionType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "auctionedToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "auctionedTokenIdOrAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "biddingToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startingBid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minBidDelta",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadlineExtension",
        "type": "uint256"
      }
    ],
    "name": "createAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC721Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bidAmount",
        "type": "uint256"
      }
    ],
    "name": "placeBid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      }
    ],
    "name": "withdrawItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export class EnglishAuctionService implements IAuctionService {
  contractAddress: Address = "0x30562E1d406FF878e1ceCbDe12322f971F916a7E";
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

  async getLastNAuctions(n: number = 10, publicClient?: any): Promise<any[]> {
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
          abi: ENGLISH_ABI,
          functionName: 'auctions',
          args: [i]
        });
      }
      const results = await readContracts(wagmi_config, { contracts });
      const mappedAuctions = await Promise.all(
        results
          .filter((result: any) => !result.error && result.result)
          .map(async (result: any) => await this.mapAuctionData(result.result, publicClient))
      );
      return mappedAuctions
        .filter((auction: any) => auction !== null)
        .reverse(); // Show newest first
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
        parseEther(String(params.auctionedTokenIdOrAmount)),
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
          parseEther(String(params.auctionedTokenIdOrAmount)),
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

  private async mapAuctionData(auctionData: any, publicClient?: any): Promise<any> {
    if (!auctionData || !Array.isArray(auctionData) || auctionData.length < 17) {
      console.warn("Invalid auction data:", auctionData);
      return null;
    }

    let auctionedTokenName = "Unknown Token";
    let biddingTokenName = "Unknown Token";
    
    if (publicClient) {
      try {
        auctionedTokenName = await getTokenName(publicClient, auctionData[6]);
        biddingTokenName = await getTokenName(publicClient, auctionData[8]);
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
}
