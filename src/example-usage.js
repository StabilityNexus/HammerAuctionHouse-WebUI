import { ethers } from "ethers";
import { AllPayAuctionClient } from "./api.js";

async function main() {
  try {
    const provider = new ethers.JsonRpcProvider(
      "https://rpc.holesky.ethpandaops.io"
    );
    const signer = new ethers.Wallet(
      "ddfefc3fdb82ee66d8567b74281bf109d6d4fcbd8e258849ed1b5686d3ff1020",
      provider
    );

    const auctionClient = new AllPayAuctionClient(
      "0x82d3ABD972eD3Ed4278C8cc3A97D54137859c181",
      signer
    );

    // Create auction example
    // const result = await auctionClient.createAuction(
    //   "My Auction",
    //   "Description",
    //   "https://image.url",
    //   1,
    //   "0x85DB289662cEC6aaC1e173adb3C27b3a6F0dc073",
    //   ethers.parseEther("10"),
    //   ethers.parseEther("0.1"),
    //   ethers.parseEther("0.01"),
    //   BigInt(300),
    //   BigInt(3600)
    // );

    // const result = await auctionClient.getAllAuctions();
    // const result = await auctionClient.getAuction(1);
    // const result = await auctionClient.placeBid(1, ethers.parseEther("0.1"));
    // const result = await auctionClient.withdrawFunds(1);

    // Fetch and log bids for a specific auction ID
    const auctionId = 1; // Replace with the desired auction ID
    const bids = await auctionClient.getAuctionBids(auctionId);
    console.log("Bids for auction", auctionId, bids);

    console.log("Auction created", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
