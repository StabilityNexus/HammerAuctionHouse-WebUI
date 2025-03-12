import { Contract, ethers, Signer } from "ethers"

interface AuctionData {
  id: string
  name: string
  description: string
  imageUrl: string
  auctionType: number
  auctioneer: string
  tokenAddress: string
  tokenIdOrAmount: string
  startingBid: string
  highestBid: string
  highestBidder: string
  deadline: string
  minBidDelta: string
  deadlineExtension: string
  totalBids: string
  availableFunds: string
}

interface BidEvent {
  auctionId: string
  bidder: string
  amount: string
  timestamp: number
}

const ABI = [
  "event AuctionCreated(uint256 indexed auctionId, string name, string description, string imageUrl, uint8 auctionType, address indexed auctioneer, address tokenAddress, uint256 tokenIdOrAmount, uint256 startingBid, uint256 highestBid, uint256 deadline)",
  "event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount)",
  "function createAuction(string memory name, string memory description, string memory imageUrl, uint8 auctionType, address tokenAddress, uint256 tokenIdOrAmount, uint256 startingBid, uint256 minBidDelta, uint256 deadlineExtension, uint256 deadline) external returns (uint256)",
  "function placeBid(uint256 auctionId) external payable",
  "function hasEnded(uint256 auctionId) external view returns (bool)",
  "function withdrawAuctionedItem(uint256 auctionId) external",
  "function withdrawFunds(uint256 auctionId) external",
  "function auctions(uint256) external view returns (uint256 id, string name, string description, string imageUrl, uint8 auctionType, address auctioneer, address tokenAddress, uint256 tokenIdOrAmount, uint256 startingBid, uint256 highestBid, address highestBidder, uint256 deadline, uint256 minBidDelta, uint256 deadlineExtension, uint256 totalBids, uint256 availableFunds)",
]

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
]

const ERC721_ABI = [
  "function approve(address to, uint256 tokenId)",
  "function balanceOf(address) view returns (uint256)",
]

export class AllPayAuctionClient {
  private contract: Contract

  constructor(contractAddress: string, signer: Signer | ethers.Provider) {
    this.contract = new ethers.Contract(contractAddress, ABI, signer)
  }

  async createAuction(
    name: string,
    description: string,
    imageUrl: string,
    auctionType: string,
    tokenAddress: string,
    tokenIdOrAmount: bigint,
    startingBid: bigint,
    minBidDelta: bigint,
    deadlineExtension: bigint,
    deadline: bigint
  ): Promise<ethers.ContractTransactionReceipt> {
    try {
      // For NFT (type 0)
      if (auctionType === "0") {
        const nftContract = new ethers.Contract(
          tokenAddress,
          ERC721_ABI,
          this.contract.runner
        )
        // For NFTs, we don't need to parseEther for the tokenId
        const actualTokenId = tokenIdOrAmount.toString()
        const tx = await nftContract.approve(
          this.contract.target,
          actualTokenId
        )
        await tx.wait()

        // Create auction with original tokenId
        const auctionTx = await this.contract.createAuction(
          name,
          description,
          imageUrl,
          auctionType,
          tokenAddress,
          actualTokenId, // Use the tokenId directly for NFTs
          startingBid,
          minBidDelta,
          deadlineExtension,
          deadline
        )
        return await auctionTx.wait()
      }
      // For ERC20 (type 1)
      else {
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ERC20_ABI,
          this.contract.runner
        )
        const tx = await tokenContract.approve(
          this.contract.target,
          tokenIdOrAmount
        )
        await tx.wait()

        // Create auction with token amount
        const auctionTx = await this.contract.createAuction(
          name,
          description,
          imageUrl,
          auctionType,
          tokenAddress,
          tokenIdOrAmount,
          startingBid,
          minBidDelta,
          deadlineExtension,
          deadline
        )
        return await auctionTx.wait()
      }
    } catch (error) {
      console.error("Error creating auction:", error)
      throw error
    }
  }

  async placeBid(
    auctionId: number,
    bidAmount: bigint
  ): Promise<ethers.ContractTransactionReceipt> {
    try {
      const tx = await this.contract.placeBid(auctionId, {
        value: bidAmount,
      })
      return await tx.wait()
    } catch (error) {
      console.error("Error placing bid:", error)
      throw error
    }
  }

  async isEnded(auctionId: number): Promise<boolean> {
    return this.contract.hasEnded(auctionId)
  }

  async withdrawAuctionedItem(
    auctionId: number
  ): Promise<ethers.ContractTransactionReceipt> {
    return await this.contract.withdrawAuctionedItem(auctionId)
  }

  async withdrawFunds(
    auctionId: number
  ): Promise<ethers.ContractTransactionReceipt> {
    return await this.contract.withdrawFunds(auctionId)
  }

  async getAuction(auctionId: number): Promise<AuctionData> {
    const auction = await this.contract.auctions(auctionId)
    return {
      id: auction.id.toString(),
      name: auction.name,
      description: auction.description,
      imageUrl: auction.imageUrl,
      auctionType: auction.auctionType,
      auctioneer: auction.auctioneer,
      tokenAddress: auction.tokenAddress,
      tokenIdOrAmount: auction.tokenIdOrAmount.toString(),
      startingBid: auction.startingBid.toString(),
      highestBid: auction.highestBid.toString(),
      highestBidder: auction.highestBidder,
      deadline: auction.deadline.toString(), // Blockchain stores timestamp in seconds
      minBidDelta: auction.minBidDelta.toString(),
      deadlineExtension: auction.deadlineExtension.toString(),
      totalBids: auction.totalBids.toString(),
      availableFunds: auction.availableFunds.toString(),
    }
  }

  async getAllAuctions(): Promise<AuctionData[]> {
    try {
      const provider = this.contract.runner?.provider as ethers.Provider
      const latestBlock = await provider.getBlockNumber()
      const startBlock = Math.max(1, latestBlock - 50000) // Only look at last 50,000 blocks
      const auctions: AuctionData[] = []

      console.log(`Fetching events from block ${startBlock} to ${latestBlock}`)

      const events = await this.contract.queryFilter(
        "AuctionCreated",
        startBlock,
        latestBlock
      )

      for (const event of events) {
        try {
          const auctionId = (event as ethers.EventLog).args.auctionId.toString()
          auctions.push(await this.getAuction(parseInt(auctionId)))
        } catch (error) {
          console.error(
            `Error fetching auction ${(event as ethers.EventLog).args.auctionId}:`,
            error
          )
        }
      }

      return auctions
    } catch (error) {
      console.error("Error fetching all auctions:", error)
      throw error
    }
  }

  async getAuctionBids(auctionId: number): Promise<BidEvent[]> {
    const provider = this.contract.runner?.provider as ethers.Provider
    const latestBlock = await provider.getBlockNumber()
    const startBlock = Math.max(1, latestBlock - 50000) // Only look at last 50,000 blocks

    const events = await this.contract.queryFilter(
      "BidPlaced",
      startBlock,
      latestBlock
    )
    const filteredEvents = events.filter(
      (event) =>
        (event as ethers.EventLog).args.auctionId.toString() ===
        auctionId.toString()
    )

    // Get block data for all filtered events
    const eventPromises = filteredEvents.map(async (event) => {
      const block = await event.getBlock()
      return {
        auctionId: (event as ethers.EventLog).args.auctionId.toString(),
        bidder: (event as ethers.EventLog).args.bidder,
        amount: (event as ethers.EventLog).args.amount.toString(),
        timestamp: block.timestamp, // Get timestamp from block data
      }
    })

    return Promise.all(eventPromises)
  }

  onAuctionCreated(callback: (event: any) => void): void {
    this.contract.on("AuctionCreated", callback)
  }

  onBidPlaced(callback: (event: any) => void): void {
    this.contract.on("BidPlaced", callback)
  }

  onAuctionEnded(callback: (event: any) => void): void {
    this.contract.on("AuctionEnded", callback)
  }
}
