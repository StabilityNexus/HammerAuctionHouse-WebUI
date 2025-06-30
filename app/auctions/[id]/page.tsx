import { mockAuctions } from "@/lib/mock-data";
import { AuctionDetail } from "./auction-detail";
import { decode } from "@/lib/storage";

/**
 * Generates an array of parameter objects for static auction pages.
 *
 * Each object contains the `id` of an auction as a string, suitable for use in static site generation.
 *
 * @returns An array of objects with `id` properties representing auction identifiers.
 */
export function generateStaticParams() {
  return mockAuctions.map((auction) => ({
    id: auction.id.toString(),
  }));
}

/**
 * Renders the auction detail page for a given auction ID.
 *
 * Awaits the provided `params` promise to extract the auction ID, decodes it to obtain protocol and numeric ID, and renders the `AuctionDetail` component with these values.
 */
export default async function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const auctionId = resolvedParams.id;
  const {protocol, id} = decode(auctionId);
  return <AuctionDetail protocol={protocol} id={BigInt(id)} />;
}