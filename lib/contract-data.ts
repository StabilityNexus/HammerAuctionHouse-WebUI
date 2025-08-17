
export const ALLPAY_ABI = [
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

export const EXPONENTIAL_DUTCH_ABI = [
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
        "name": "settlePrice",
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
] as const;

export const LINEAR_DUTCH_ABI = [
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
        "name": "settlePrice",
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
] as const;

export const LOGARITHMIC_DUTCH_ABI = [
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
        "internalType": "uint256",
        "name": "settlePrice",
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
] as const;

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
        "name": "minBid",
        "type": "uint256"
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

export interface ChainContracts {
  English: string;
  AllPay: string;
  Linear: string;
  Exponential: string;
  Logarithmic: string;
  Vickrey: string;
}

export const RANGE_LIMIT: Record<number, bigint> = {
  1: BigInt(0),
  61: BigInt(0),
  137: BigInt(0),
  56: BigInt(0),
  8453: BigInt(0),
  5115: BigInt(999),
  63: BigInt(10000000),
}

export const AUCTION_CONTRACTS: Record<number, ChainContracts> = {
  // Ethereum Mainnet
  1: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // Ethereum Classic
  61: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // Polygon
  137: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // BSC
  56: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // Base
  8453: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // ETC Testnet
  63: {
    English: "0x6B8419316646d750c8f812249541F01A69783498",
    AllPay: "0x0cA32365cD9157cB5846B66ABd17136618bC4F99",
    Linear: "0x5F02Bf7cee31ffe8050dc096d6ADc3c80319dE90",
    Exponential: "0x25ddf5F3d7ea3061752a0F5Cb43088D44a62E20e",
    Logarithmic: "0x46Bf2a057d051c2eA0ba9b0D90AeB1796308146A",
    Vickrey: "0x08f14f4c030c60826742Fa5C64915b312473B061",
  },
  // Citera Testnet
  5115: {
    English: "0xb082b7D4734FD7aaCB13De6cf281f6E631fF219E",
    AllPay: "0x389DbA9d0f77fec16835C0BfBd2442A748681F80",
    Linear: "0x8972e8Fe7E263f146A972FFc24DD2Ac9D3251B08",
    Exponential: "0xc82016DDc188a024EeB0873007f75f5FC7Bc8d55",
    Logarithmic: "0xD0CC7d8CC2C369597a042772d22D3e84CE8d4D99",
    Vickrey: "0xEf5c73B00A263bA71c6318Ead9A345b1d61B3D0d",
  },
};
