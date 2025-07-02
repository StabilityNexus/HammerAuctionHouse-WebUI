import { Address, erc20Abi, erc721Abi, keccak256, encodePacked, parseEther, parseAbiItem } from "viem";
import { getToken, readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { getTokenName, IAuctionService, VickreyAuctionParams } from "../auction-service";
import { Bid } from "../mock-data";
import { generateCode } from "../storage";

export const VICKREY_ABI =[
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
          "name": "bidCommitEnd",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bidRevealEnd",
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
          "indexed": true,
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
      "name": "BidRevealed",
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
          "name": "availableFunds",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "winningBid",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bidCommitEnd",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bidRevealEnd",
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
          "internalType": "uint256",
          "name": "auctionId",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "commitment",
          "type": "bytes32"
        }
      ],
      "name": "commitBid",
      "outputs": [],
      "stateMutability": "payable",
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
      "name": "commitments",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
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
          "name": "bidCommitDuration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bidRevealDuration",
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
        },
        {
          "internalType": "bytes32",
          "name": "salt",
          "type": "bytes32"
        }
      ],
      "name": "revealBid",
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

export class VickreyAuctionService implements IAuctionService {
  contractAddress: Address = "0x56587c523FdAeE847463F93D58Cfd2e8023dee54";

  private async mapAuctionData(auctionData: any, publicClient?: any): Promise<any> {
    if (!auctionData || !Array.isArray(auctionData) || auctionData.length < 16) {
      console.warn("Invalid Vickrey auction data:", auctionData, "Expected 16 fields, got:", auctionData?.length);
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
    };
  }

  static generateCommitment(bidAmount: bigint, salt: string): `0x${string}` {
    console.log("Generating commitment with bidAmount:", bidAmount, "and salt:", salt);
    const saltBytes = keccak256(encodePacked(['string'], [salt]));
    return keccak256(encodePacked(['uint256', 'bytes32'], [bidAmount, saltBytes]));
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

  async getLastNAuctions(n: number = 10, publicClient?: any): Promise<any[]> {
    try {
      const counter = await this.getAuctionCounter();
      if (counter === BigInt(0)) return [];
      const start = counter > BigInt(n) ? counter - BigInt(n) + BigInt(0) : BigInt(0);
      const end = counter;
      const contracts = [];
      for (let i = start; i < end; i++) {
        contracts.push({
          address: this.contractAddress,
          abi: VICKREY_ABI,
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
      console.error("Error fetching last N Vickrey auctions:", error);
      throw error;
    }
  }

  async createAuction(writeContract: any, params: VickreyAuctionParams): Promise<void> {
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
        abi: VICKREY_ABI,
        functionName: "createAuction",
        args: [
          params.name,
          params.description,
          params.imgUrl,
          Number(params.auctionType),
          params.auctionedToken,
          (params.auctionType === BigInt(0)?params.auctionedTokenIdOrAmount:parseEther(String(params.auctionedTokenIdOrAmount))),
          params.biddingToken,
          Number(params.bidCommitDuration),
          Number(params.bidRevealDuration)
        ],
      });
    } catch (error) {
      console.error("Error creating Vickrey auction:", error);
      throw error;
    }
  }

  async commitBid(writeContract: any, auctionId: bigint, commitment: `0x${string}`): Promise<void> {
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

  async revealBid(writeContract: any, auctionId: bigint, bidAmount: bigint, salt: string): Promise<void> {
    try {
      const biddingToken = (await this.getAuction(auctionId)).biddingToken
      const saltBytes = keccak256(encodePacked(['string'], [salt]));
      await this.approveToken(
        writeContract,
        biddingToken,
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

  async placeBid(
    writeContract: any,
    auctionId: bigint,
    bidAmount: bigint,
    tokenAddress: Address,
    auctionType: bigint
  ): Promise<void> {
    throw new Error("Vickrey auction uses commit/reveal mechanism - use commitBid and revealBid instead");
  }

  async withdrawFunds(writeContract: any, auctionId: bigint): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress,
        abi: VICKREY_ABI,
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
        abi: VICKREY_ABI,
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
            abi: VICKREY_ABI,
            functionName: 'auctions',
            args: [auctionId]
          }
        ]
      });
      const auctionData = data[0].result;
      const mappedAuction = await this.mapAuctionData(auctionData, publicClient);
      if (!mappedAuction) {
        throw new Error(`Invalid Vickrey auction data for ID ${auctionId}`);
      }
      return mappedAuction;
    } catch (error) {
      console.error("Error fetching Vickrey auction data:", error);
      throw error;
    }
  }

  async getAllAuctions(client: any, startBlock: bigint, endBlock: bigint): Promise<any[]> {
    try {
      const auctions = await this.getLastNAuctions(50, client); // Get last 50 auctions
      return auctions;
    } catch (error) {
      console.error("Error fetching all Vickrey auctions:", error);
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
          'event BidRevealed(uint256 indexed auctionId, address indexed bidder, uint256 bidAmount)'
        ),
        args: { auctionId },
        fromBlock: startBlock,
        toBlock: endBlock,
      });
      console.log("Fetched logs: ",logs)
      const bids = await Promise.all(logs.map(async (log: any, index: number) => {
        const block = await client.getBlock({ blockNumber: log.blockNumber });
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
