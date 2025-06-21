import { getBlockNumber, readContracts } from '@wagmi/core'
import { wagmi_config } from "@/config"
import { Abi, Address, erc20Abi, erc721Abi, parseAbiItem } from "viem";


export const abi = [
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
]
const contractAddress = "0x6e9EFdB9943261C9cc0dCe6fa67769ABF513DE27";

export interface AllPayAuction {
  name: string;
  desc: string;
  imgUrl: string;
  auctionType: bigint;
  auctionedToken: Address;
  auctionedTokenIdOrAmount: bigint;
  biddingToken: Address;
  startingBid: bigint;
  minBidDelta: bigint;
  duration: bigint;
  deadlineExtension: bigint;
}

async function approveToken(writeContract: any, tokenAddress: Address, spender: Address, amountOrId: BigInt, isNFT: boolean) {
  try {
    if (isNFT) {
      writeContract({
        address: tokenAddress,
        abi: erc721Abi,
        functionName: "approve",
        args: [spender, amountOrId],
      });
    } else {
      writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amountOrId],
      });
    }
  } catch (error) {
    console.error("Error approving token:", error);
  }
}

export async function createAuction(writeContract: any, {
  name,
  desc,
  imgUrl,
  auctionType,
  auctionedToken,
  auctionedTokenIdOrAmount,
  biddingToken,
  startingBid,
  minBidDelta,
  duration,
  deadlineExtension,
}: AllPayAuction) {
  try {
    await approveToken(writeContract, auctionedToken, contractAddress, auctionedTokenIdOrAmount, auctionType == BigInt(0));

    writeContract({
      address: contractAddress,
      abi,
      functionName: "createAuction",
      args: [
        name,
        desc,
        imgUrl,
        auctionType,
        auctionedToken,
        auctionedTokenIdOrAmount,
        biddingToken,
        startingBid,
        minBidDelta,
        duration,
        deadlineExtension,
      ],
    });
  } catch (error) {
    console.error("Error creating auction:", error);
  }
}

export async function placeBid(writeContract: any, auctionId: BigInt, bidAmount: BigInt, tokenAddress: Address, auctionType: bigint) {
  try {
    await approveToken(writeContract, tokenAddress, contractAddress, bidAmount, auctionType == BigInt(0));
    await writeContract({
      address: contractAddress,
      abi,
      functionName: "placeBid",
      args: [auctionId, bidAmount],
    });
  } catch (error) {
    console.error("Error placing bid:", error);
  }
}

export async function withdrawFunds(writeContract: any, auctionId: bigint) {
  try {
    writeContract({
      address: contractAddress,
      abi,
      functionName: "withdrawFunds",
      args: [auctionId],
    });
  } catch (error) {
    console.error("Error withdrawing funds:", error);
  }
}

export async function withdrawItem(writeContract: any, auctionId: bigint) {
  try {
    writeContract({
      address: contractAddress,
      abi,
      functionName: "withdrawItem",
      args: [auctionId],
    })
  } catch (error) {
    console.error("Error withdrawing item:", error);
  }
}

//Read functions will include fetchin auction data corresponding to the auctionId
export async function getAuction(auctionId: bigint) {
  try {
    const data = await readContracts(wagmi_config, {
      contracts: [
        {
          address: contractAddress,
          abi: abi as Abi,
          functionName: 'auctions',
          args: [auctionId]
        }
      ]
    });
    return data;
  } catch (error) {
    console.error("Error fetching auction data:", error);
    throw error;
  }
}
// Fetch bidders with a provided PublicClient
export async function getBidders(
  client: any,
  auctionId: bigint
) {
  try {
    const currentBlock = await getBlockNumber(wagmi_config);
    const fromBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
    const logs = await client.getLogs({
      address: contractAddress,
      event: parseAbiItem(
        'event bidPlaced(uint256 indexed auctionId, address bidder, uint256 bidAmount)'
      ),
      args: [auctionId],
      fromBlock,
      toBlock: currentBlock,
    });
    return logs;
  } catch (error) {
    console.error("Error fetching bidders:", error);
    throw error;
  }
}

export async function getAllAuctions(client: any) {
  try {
    const currentBlock = await getBlockNumber(wagmi_config);
    const fromBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
    const logs = await client.getLogs({
      address: contractAddress,
      event: parseAbiItem(
        'event AuctionCreated(uint256 indexed Id,string name,string description,string imgUrl,address auctioneer,uint8 auctionType,address auctionedToken,uint256 auctionedTokenIdOrAmount,address biddingToken,uint256 startingBid,uint256 minBidDelta,uint256 deadline,uint256 deadlineExtension)'
      ),
      fromBlock,
      toBlock: currentBlock,
    });
    return logs.map((log: any) => log.args);
  } catch (error) {
    console.error("Error fetching bidders:", error);
    throw error;
  }
}


//complete read functions for all
// then events fetching
// then modularize the code
// then UI components