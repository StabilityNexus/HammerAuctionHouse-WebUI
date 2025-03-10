export interface Auction {
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

export interface AppContextType {
  account: string
  setAccount: React.Dispatch<React.SetStateAction<string>>
  connected: boolean
  setConnected: React.Dispatch<React.SetStateAction<boolean>>
  signer: any
  setSigner: React.Dispatch<React.SetStateAction<any>>
  auctionClient: any
  setAuctionClient: React.Dispatch<React.SetStateAction<any>>
}
