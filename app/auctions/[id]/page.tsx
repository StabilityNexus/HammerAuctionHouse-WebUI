import { mockAuctions } from "@/lib/mock-data";
import { AuctionDetail } from "./auction-detail";
import { decode } from "@/lib/storage";

export function generateStaticParams() {
  return mockAuctions.map((auction) => ({
    id: auction.id.toString(),
  }));
}

export default async function AuctionPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const auctionId = resolvedParams.id;
  const {protocol, id} = decode(auctionId);
  return <AuctionDetail protocol={protocol} id={BigInt(id)} />;
}