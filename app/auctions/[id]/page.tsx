import { getAuctionById, mockAuctions } from "@/lib/mock-data";
import { AuctionDetail } from "./auction-detail";

// This needs to be outside the client component
export function generateStaticParams() {
  return mockAuctions.map((auction) => ({
    id: auction.id.toString(),
  }));
}

export default async function AuctionPage({ params }: { params: { id: string } }) {
  // For now, still use mock data as fallback, but the AuctionDetail component
  // will decode the encoded ID and fetch the real auction data using the appropriate auction service
  const resolvedParams = await params;
  const auction = getAuctionById(resolvedParams.id);
  return <AuctionDetail auction={auction} encodedAuctionId={resolvedParams.id} />;
}