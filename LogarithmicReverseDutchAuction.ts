import { useWriteContract } from "wagmi";
import { Address, erc20Abi, erc721Abi } from "viem";
import { write } from "fs";

export const abi=  [
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
  auctionType: BigInt;
  auctionedToken: Address;
  auctionedTokenIdOrAmount: BigInt;
  biddingToken: Address;
  startingPrice: BigInt;
  reservedPrice: BigInt;
  decayFactor: BigInt;
  duration: BigInt;
}


async function approveToken(writeContract: any, tokenAddress: Address, spender: Address, amountOrId: BigInt,isNFT: boolean): Promise<void> {
  try {
    if(isNFT){
      writeContract({
        address: tokenAddress,
        abi: erc721Abi,
        functionName: "approve",
        args: [spender, amountOrId],
      });
    }else{
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
}: LogarithmicReverseDutchAuction): Promise<void> {
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

export async function placeBid(writeContract: any, auctionId: BigInt, bidAmount: BigInt,tokenAddress: Address,auctionType: BigInt): Promise<void> {
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


async function getCurrentPrice(){
    //to be implemented
}

export async function withdrawItem(writeContract: any, auctionId: BigInt,auctionType: BigInt): Promise<void> {
    try {
        const currentPrice= await getCurrentPrice();
        approveToken(writeContract, contractAddress, contractAddress, currentPrice, auctionType==BigInt(0)); // Assuming auctionedToken is the contract itself for NFT
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

export async function withdrawFunds(writeContract: any,auctionId: BigInt): Promise<void> {
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
// Call the test function
// testCreateAuction();