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
  Search,
  Wallet,
  BadgeCheck,
  Award,
  ShieldCheck,
  Settings,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/hero-background";
import { HowItWorksSection } from "@/components/how-it-works";

export default function Home() {
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
      title: "Global Access",
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
      title: "Auction ERC-20 & ERC-721 Tokens",
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
            Own the Future of Auctions.
            <span className="block text-primary">
              On-Chain. Transparent. Yours.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Hammer Auction House brings the transparency and security of blockchain to
            auctions, creating a seamless platform for buying and selling
            digital assets.
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

      <section className="py-16 bg-muted/20  flex items-center justify-center">
        <div className="container px-4 ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Auctions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover unique digital assets from creators around the world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Link href={`/auctions/${i}`} key={i} className="group">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative bg-card rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={`https://images.pexels.com/photos/315${
                        i + 940
                      }/pexels-photo-315${
                        i + 940
                      }.jpeg?auto=compress&cs=tinysrgb&w=800`}
                      alt={`Featured auction ${i}`}
                      className="object-cover transition-transform group-hover:scale-105"
                      fill
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="px-2 py-1 bg-primary/90 text-primary-foreground rounded-md text-sm w-fit mb-2">
                        Ending Soon
                      </div>
                      <h3 className="text-lg font-bold">
                        Digital Masterpiece #{i}
                      </h3>
                      <p className="text-white/90 text-sm">
                        Current bid: {1 + i * 0.5}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
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
            <h2 className="text-3xl font-bold mb-4">Why Choose Hammer Auction House?</h2>
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
