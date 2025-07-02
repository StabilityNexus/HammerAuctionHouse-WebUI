import { AuctionDetail } from "./auction-detail";
import { decode } from "@/lib/storage";



export default async function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const auctionId = resolvedParams.id;
  const {protocol, id} = decode(auctionId);
  return <AuctionDetail protocol={protocol} id={BigInt(id)} />;
}