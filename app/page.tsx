"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Lock,
  ScrollText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroBackground } from "@/components/hero-background";
import { HowItWorksSection } from "@/components/how-it-works";
import { useEffect, useState } from "react";
import { useChainId, usePublicClient } from "wagmi";
import { getAuctionService } from "@/lib/auction-service";
import { Auction } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "viem";

export default function Home() {
  const [featuredAuctions, setFeaturedAuctions] = useState<
    Array<Auction | null>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();
  const chainId = useChainId();

  // Fetch latest auctions from logarithmic, vickrey and english
  useEffect(() => {
    const fetchLatestAuctions = async () => {
      if (!publicClient) return;
      setIsLoading(true);
      try {
        const logarithmicService = await getAuctionService("Exponential",chainId);
        const vickreyService = await getAuctionService("Vickrey",chainId);
        const englishService = await getAuctionService("English",chainId);

        const [logarithmicAuction, vickreyAuction, englishAuction] =
          await Promise.all([
            logarithmicService.getLastNAuctions(publicClient, 1),
            vickreyService.getLastNAuctions(publicClient, 1),
            englishService.getLastNAuctions(publicClient, 1),
          ]);

        const latestAuctions = [
          ...(logarithmicAuction.length > 0 ? [logarithmicAuction[0]] : []),
          ...(vickreyAuction.length > 0 ? [vickreyAuction[0]] : []),
          ...(englishAuction.length > 0 ? [englishAuction[0]] : []),
        ].filter((auction): auction is Auction => auction !== null);

        setFeaturedAuctions(latestAuctions);
      } catch (error) {
        console.error("Error fetching featured auctions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAuctions();
  }, [publicClient]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const features = [
    {
      icon: Shield,
      title: "Decentralized & Immutable",
      description:
        "Built entirely on blockchain technology, ensuring decentralization and immutability. No centralized backends, ever.",
    },
    {
      icon: Zap,
      title: "Multiple Auction Types",
      description:
        "English, Dutch, Vickrey, and All-Pay auctions to suit every need and strategy, all governed by immutable smart contracts.",
    },
    {
      icon: Globe,
      title: "Permissionless Global Access",
      description:
        "Participate in auctions from anywhere in the world with just a Web3 wallet. No intermediaries, no restrictions.",
    },
    {
      icon: ScrollText, // Replace with the correct imported React component for the SVG
      title: "Code is Law",
      description:
        "Smart contracts enforce rules autonomously, eliminating the need for governance or manual intervention.",
    },
    {
      icon: TrendingUp,
      title: "Real-time Bidding",
      description:
        "Live updates and instant bid confirmations powered by decentralized networks for a seamless experience.",
    },
    {
      icon: Lock,
      title: "ERC-20 & ERC-721 Supported",
      description:
        "Create auctions for both fungible (ERC-20) and non-fungible (ERC-721) tokens with complete transparency and trust.",
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden w-screen">
        <HeroBackground />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container relative z-10 px-4 text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          >
            Hammer Auction House
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Participate in the future of auctions.
            <br />
            HAH brings the transparency and security of blockchains to auction,
            <br />
            providing a seamless platform for buying and selling digital assets.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/auctions" className="px-8">
                Browse Auctions
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/create" className="px-8">
                Create Auction
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            }}
          >
            <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-muted/20 flex items-center justify-center">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Auctions</h2>{" "}
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Check out our latest english, vickrey, and logarithmic dutch
              auctions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-3 text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4">Loading featured auctions...</p>
              </div>
            ) : featuredAuctions.length > 0 ? (
              featuredAuctions.map((auction) => {
                if (!auction) return null;
                const status =
                  Number(auction.deadline) * 1000 - Date.now() > 0
                    ? "active"
                    : "ended";
                const statusConfig =
                  status === "active"
                    ? {
                        text: "Active",
                        bgColor: "bg-green-500",
                        textColor: "text-green-500",
                        bgOpacity: "bg-opacity-10",
                      }
                    : {
                        text: "Ended",
                        bgColor: "bg-gray-500",
                        textColor: "text-gray-500",
                        bgOpacity: "bg-opacity-10",
                      };

                return (
                  <Link
                    href={`/auctions?id=${auction.id}`}
                    key={auction.id}
                    className="group"
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="relative bg-card rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg border"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={auction.imgUrl}
                          alt={auction.name}
                          className="object-cover transition-transform group-hover:scale-105"
                          fill
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <Badge
                            className={`px-2 py-1 ${statusConfig.bgColor} ${statusConfig.bgOpacity} ${statusConfig.textColor}`}
                          >
                            {statusConfig.text}
                          </Badge>
                          <div className="flex items-center justify-between gap-2 mt-2">
                            <h3 className="text-lg font-bold">
                              {auction.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="capitalize text-white border-white/20"
                            >
                              {auction.protocol}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-white/90 text-sm">
                              {BigInt(auction.auctionType) === BigInt(1)
                                ? `${Number(
                                    formatEther(
                                      auction.auctionedTokenIdOrAmount
                                    )
                                  ).toFixed(4)} ${
                                    auction.auctionedTokenName || "Items"
                                  }`
                                : `#${auction.auctionedTokenIdOrAmount.toString()} ${
                                    auction.auctionedTokenName || "NFT"
                                  }`}
                            </p>
                            <div className="flex items-center text-sm text-white/75 gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>
                                {status === "active"
                                  ? `Ends ${formatDistanceToNow(
                                      Number(auction.deadline) * 1000,
                                      { addSuffix: true }
                                    )}`
                                  : `Ended ${formatDistanceToNow(
                                      Number(auction.deadline) * 1000,
                                      { addSuffix: true }
                                    )}`}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/20 text-sm text-white/75">
                            By{" "}
                            {`${auction.auctioneer.substring(
                              0,
                              6
                            )}...${auction.auctioneer.substring(38)}`}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">
                  No featured auctions available
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/auctions" className="gap-2">
                View All Auctions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center overflow-hidden w-screen">
        <HowItWorksSection />
      </section>

      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Hammer Auction House?
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Experience the future of auctions with cutting-edge blockchain
              technology and user-centric design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group p-8  bg-card/30 backdrop-blur-md border rounded-xl transition-all duration-300 hover:bg-card/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/15 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 " />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
