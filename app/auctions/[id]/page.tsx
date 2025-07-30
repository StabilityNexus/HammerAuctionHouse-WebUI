import { AuctionDetail } from "./auction-detail";
import { decode } from "@/lib/storage";
import { notFound } from "next/navigation";

export default async function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const auctionId = resolvedParams.id;
    const decoded = decode(auctionId);
    
    if (!decoded || !decoded.id || isNaN(Number(decoded.id))) {
      notFound();
    }

    return <AuctionDetail protocol={decoded.protocol} id={BigInt(decoded.id)} />;
  } catch (error) {
    notFound();
  }
}