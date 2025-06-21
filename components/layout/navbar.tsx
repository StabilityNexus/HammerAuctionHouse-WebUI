"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
// import { ConnectButton } from "@/components/ui/wallet-button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";
import { abi, AllPayAuction, getAuction, getBidders } from "@/AllPayAuction";
import { useWriteContract, usePublicClient } from "wagmi";
import { erc20Abi } from "viem";
import { ethers } from "ethers";
import { createAuction } from "@/AllPayAuction";
import { use } from "react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Auctions", path: "/auctions" },
  { name: "Create", path: "/create" },
  { name: "Dashboard", path: "/dashboard" },
];

export function Navbar() {
  const { data: hash, writeContract } = useWriteContract();
  const publicClient = usePublicClient({chainId: 63});
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-center w-screen border-b bg-background/80 backdrop-blur-md">
      <div className="container w-full flex h-17 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Hammer Auction House Logo"
              className="h-15 w-15 object-contain dark:invert"
            />
            {/* <span className="text-lg font-bold text-foreground">Hammer Auction House</span> */}
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-1.5",
                  pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
                {pathname === item.path && (
                  <motion.div
                    className="absolute -bottom-px left-0 h-[2px] w-full bg-primary"
                    layoutId="navbar-underline"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ConnectButton accountStatus={"address"} showBalance={false} />
          <ModeToggle />
          <Button
            size="sm"
            variant="default"
            asChild
            className="hidden md:flex"
            onClick={async () => {
              try {
                const data = await getBidders(publicClient, BigInt(1));
                console.log("Auction Data:", data);
              } catch (error) {
                console.error("Error fetching bidders:", error);
              }
            }}
          >
            <Link href="/create">Create Auction</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
