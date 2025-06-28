import { Address, erc20Abi, erc721Abi, keccak256, encodePacked, parseEther } from "viem";
import { readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { IAuctionService, VickreyAuctionParams } from "../auction-service";
import { Bid } from "../mock-data";

export const VICKREY_ABI = [
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

// Vickrey Auction Service Implementation
export class VickreyAuctionService implements IAuctionService {
  contractAddress: Address = "0x19fcfb4c99cB7313e7c24dBD5114180Fd104B2A8";

  private mapAuctionData(auctionData: any): any {
    if (!auctionData || !Array.isArray(auctionData) || auctionData.length < 16) {
      console.warn("Invalid Vickrey auction data:", auctionData, "Expected 16 fields, got:", auctionData?.length);
      return null;
    }

    return {
      id: auctionData[0],
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
    };
  }

  // Helper function to generate commitment hash
  static generateCommitment(bidAmount: bigint, salt: string): `0x${string}` {
    console.log("Generating commitment with bidAmount:", bidAmount, "and salt:", salt);
    const saltBytes = keccak256(encodePacked(['string'], [salt]));
    return keccak256(encodePacked(['uint256', 'bytes32'], [bidAmount, saltBytes]));
  }
  //CDn8ISslPUVqWcZu
  //10

  // Helper method for token approval
  private async approveToken(
    writeContract: any,
    tokenAddress: Address,
    spender: Address,
    amountOrId: bigint,
    isNFT: boolean
  ): Promise<void> {
    try {
      if (isNFT) {
        // For NFTs, use approve function
        await writeContract({
          address: tokenAddress,
          abi: erc721Abi,
          functionName: "approve",
          args: [spender, amountOrId],
        });
      } else {
        // For ERC20 tokens, use approve function with amount
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

  async getLastNAuctions(n: number = 10): Promise<any[]> {
    try {
      const counter = await this.getAuctionCounter();
      console.log("Vickrey auction counter:", counter);
      if (counter === BigInt(0)) return [];

      const start = counter > BigInt(n) ? counter - BigInt(n) + BigInt(0) : BigInt(0);
      const end = counter;

      console.log(`Fetching Vickrey auctions from ${start} to ${end}`);

      const contracts = [];
      for (let i = start; i <= end; i++) {
        contracts.push({
          address: this.contractAddress,
          abi: VICKREY_ABI,
          functionName: 'auctions',
          args: [i]
        });
      }

      const results = await readContracts(wagmi_config, { contracts });
      console.log("Raw Vickrey contract results:", results);
      
      const mappedAuctions = results
        .filter((result: any) => !result.error && result.result)
        .map((result: any) => this.mapAuctionData(result.result))
        .filter((auction: any) => auction !== null)
        .reverse(); // Show newest first

      console.log("Mapped Vickrey auction objects:", mappedAuctions);
      return mappedAuctions;
    } catch (error) {
      console.error("Error fetching last N Vickrey auctions:", error);
      throw error;
    }
  }

  async createAuction(writeContract: any, params: VickreyAuctionParams): Promise<void> {
    try {
      // First approve the token to be auctioned
      await this.approveToken(
        writeContract,
        params.auctionedToken,
        this.contractAddress,
        parseEther(String(params.auctionedTokenIdOrAmount)),
        params.auctionType === BigInt(0) // 0 = NFT, 1 = ERC20
      );

      console.log("Creating Vickrey auction:", params);
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
          params.auctionedTokenIdOrAmount,
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

  // Commit bid with hash commitment
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

  // Reveal bid with original bid amount and salt
  async revealBid(writeContract: any, auctionId: bigint, bidAmount: bigint, salt: string): Promise<void> {
    try {
      const saltBytes = keccak256(encodePacked(['string'], [salt]));
      
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

  // Legacy placeBid method - throws error since Vickrey uses commit/reveal
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

  async getAuction(auctionId: bigint): Promise<any> {
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
      const mappedAuction = this.mapAuctionData(auctionData);

      if (!mappedAuction) {
        throw new Error(`Invalid Vickrey auction data for ID ${auctionId}`);
      }

      return mappedAuction;
    } catch (error) {
      console.error("Error fetching Vickrey auction data:", error);
      throw error;
    }
  }

  async getBidders(client: any, auctionId: bigint, startBlock: bigint, endBlock: bigint): Promise<any[]> {
    // For Vickrey auctions, get commit events
    try {
      const filter = {
        address: this.contractAddress,
        event: {
          name: 'AuctionCreated', // We'd need a CommitBid event, using AuctionCreated as fallback
        },
        fromBlock: startBlock,
        toBlock: endBlock
      };

      // This would need proper event filtering for actual bid commits
      // For now, return empty array
      return [];
    } catch (error) {
      console.error("Error fetching Vickrey bidders:", error);
      return [];
    }
  }

  async getAllAuctions(client: any, startBlock: bigint, endBlock: bigint): Promise<any[]> {
    try {
      // Try counter-based approach first
      const auctions = await this.getLastNAuctions(50); // Get last 50 auctions
      if (auctions.length > 0) {
        return auctions;
      }

      // Fallback to empty array if no auctions found
      return [];
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
    // For Vickrey auctions, bid history is more complex due to sealed bids
    // During commit phase, no bids are visible
    // During reveal phase, only revealed bids are visible
    return [];
  }

  // Helper method to check auction phase
  async getAuctionPhase(auctionId: bigint): Promise<'commit' | 'reveal' | 'ended'> {
    try {
      const auction = await this.getAuction(auctionId);
      const now = Math.floor(Date.now() / 1000);
      
      if (now < Number(auction.bidCommitEnd)) {
        return 'commit';
      } else if (now < Number(auction.bidRevealEnd)) {
        return 'reveal';
      } else {
        return 'ended';
      }
    } catch (error) {
      console.error("Error getting auction phase:", error);
      return 'ended';
    }
  }

  // Get user's commitment for an auction
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

  // Get user's revealed bid for an auction
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
