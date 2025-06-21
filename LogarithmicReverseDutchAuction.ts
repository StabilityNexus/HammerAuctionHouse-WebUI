import { getBlockNumber, readContracts } from '@wagmi/core'
import { wagmi_config } from "@/config"
import { Abi, Address, erc20Abi, erc721Abi, parseAbiItem } from "viem";


export const abi =  [
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
          "name": "startingPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "reservedPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "decayFactor",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "deadline",
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
          "name": "startingPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "availableFunds",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reservedPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "decayFactor",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "scalingFactor",
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
          "name": "duration",
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
          "name": "startingPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reservedPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "decayFactor",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
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
          "internalType": "uint256",
          "name": "auctionId",
          "type": "uint256"
        }
      ],
      "name": "getCurrentPrice",
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

export interface LogarithmicReverseDutchAuction {
  name: string;
  desc: string;
  imgUrl: string;
  auctionType: bigint;
  auctionedToken: Address;
  auctionedTokenIdOrAmount: bigint;
  biddingToken: Address;
  startingPrice: bigint;
  reservedPrice: bigint;
  decayFactor: bigint;
  duration: bigint;
}


async function approveToken(writeContract: any, tokenAddress: Address, spender: Address, amountOrId: bigint, isNFT: boolean) {
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
  reservedPrice,
  startingPrice,
  duration,
  decayFactor
}: LogarithmicReverseDutchAuction) {
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
        startingPrice,
        reservedPrice,
        decayFactor,
        duration,
      ],
    });
  } catch (error) {
    console.error("Error creating auction:", error);
  }
}

export async function placeBid(writeContract: any, auctionId: bigint, bidAmount: bigint, tokenAddress: Address, auctionType: bigint) {
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



export async function withdrawItem(writeContract: any, auctionId: bigint, auctionType: bigint) {
  try {
    const currentPrice = await getCurrentPrice(auctionId);
    approveToken(writeContract, contractAddress, contractAddress, currentPrice, auctionType == BigInt(0)); // Assuming auctionedToken is the contract itself for NFT
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

//Read functions will include fetchin auction data corresponding to the auctionId

export async function getCurrentPrice(auctionId: bigint) {
  try {
    const data = await readContracts(wagmi_config, {
      contracts: [
        {
          address: contractAddress,
          abi: abi as Abi,
          functionName: 'getCurrentPrice',
          args: [auctionId]
        }
      ]
    });
    if (data[0].error) { throw new Error("Failed to fetch current price"); }
    return data[0].result as bigint;
  } catch (error) {
    console.error("Error fetching current price:", error);
    throw error;
  }
}

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

export async function getAllAuctions(client: any) {
  try {
    const currentBlock = await getBlockNumber(wagmi_config);
    const fromBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
    const logs = await client.getLogs({
      address: contractAddress,
      event: parseAbiItem(
        'event AuctionCreated(uint256 indexed Id,string name,string description,string imgUrl,address auctioneer,uint8 auctionType,address auctionedToken,uint256 auctionedTokenIdOrAmount,address biddingToken,uint256 startingPrice,uint256 reservedPrice,uint256 decayFactor,uint256 deadline)'
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