"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Settings,
  Search,
  Wallet,
  Award,
  ShieldCheck,
  BadgeCheck,
  Info,
  Users,
  Gavel,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tooltip?: string;
  delay?: number;
}

function StepCard({ icon, title, description, tooltip, delay = 0 }: StepCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay }}
      className="relative group"
    >
      <div className="bg-card/30 backdrop-blur-md border rounded-xl p-6 h-full transition-all duration-300 hover:bg-card/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/15 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
            {icon}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              {title}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorksSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const auctioneerSteps = [
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Configure & Preview",
      description: "Set your auction parameters including start price, duration, and type. Preview how your auction will behave before going live.",
      tooltip: "Choose from English, Dutch, All-Pay, or Vickrey auction formats",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Deploy Securely",
      description: "Deploy your auction contract on-chain with automated security checks and verification.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Manage & Complete",
      description: "Track bids, communicate with bidders, and finalize the auction when complete.",
    },
  ];

  const bidderSteps = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Discover Auctions",
      description: "Browse active auctions with advanced filtering and search capabilities.",
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Place Bids",
      description: "Connect your wallet and place bids with real-time price updates.",
      tooltip: "Supports MetaMask, WalletConnect, and other popular wallets",
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: "Win & Collect",
      description: "If you win, claim your NFT or ERC20 tokens automatically with proof of ownership on the blockchain.",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background to-background" />
      
      <div
        ref={sectionRef}
        className="container px-4 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're selling or bidding, Hammer Auction House makes it easy to participate
            in secure, transparent blockchain auctions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ">
          {/* Auctioneer Flow */}
          <div className="space-y-8 flex flex-col items-center  h-full ">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex items-center gap-3 mb-8 mt-8"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Gavel className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold">For Auctioneers</h3>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              {auctioneerSteps.map((step, index) => (
                <StepCard
                  key={index}
                  {...step}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Bidder Flow */}
          <div className="space-y-8 flex flex-col items-center  h-full ">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex items-center gap-3 mb-8 mt-8"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold">For Bidders</h3>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              {bidderSteps.map((step, index) => (
                <StepCard
                  key={index}
                  {...step}
                  delay={index * 0.1 + 0.3}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}