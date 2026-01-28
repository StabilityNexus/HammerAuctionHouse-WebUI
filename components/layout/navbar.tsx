"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
	{ name: "Home", path: "/" },
	{ name: "Auctions", path: "/auctions" },
	{ name: "Create", path: "/create" },
	{ name: "Dashboard", path: "/dashboard" },
];

export function Navbar() {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 flex items-center justify-center w-full px-4 py-1 border-b bg-background/80 backdrop-blur-md shadow-lg drop-shadow-md dark:shadow-2xl dark:shadow-white/10">
			<div className="container w-full flex h-17 items-center justify-between">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/logo.svg"
							alt="Hammer Auction House Logo"
							className="dark:invert"
							width={"60"}
							height={"60"}
							objectFit="contain"
						/>
						<span className="text-3xl font-bold text-primary">HAH!</span>
					</Link>
				</div>

				<nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
					{navItems.map((item) => (
						<Link
							key={item.path}
							href={item.path}
							className={cn(
								"text-base font-medium transition-colors hover:text-primary relative py-1.5",
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

				<div className="flex items-center gap-2">
					<ConnectButton accountStatus={"address"} showBalance={false} />
					<ModeToggle />
					<Button
						size="sm"
						variant="default"
						asChild
						className="hidden md:flex"
					>
						<Link href="/create">Create Auction</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
