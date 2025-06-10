import { getAuctionById, mockAuctions } from "@/lib/mock-data";
import { AuctionDetail } from "./auction-detail";

// This needs to be outside the client component
export function generateStaticParams() {
  return mockAuctions.map((auction) => ({
    id: auction.id.toString(),
  }));
}

export default async function AuctionPage({ params }: { params: { id: string } }) {
  const auction = getAuctionById(params.id);
  return <AuctionDetail auction={auction} />;
}