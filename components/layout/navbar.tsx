"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 flex items-center justify-center w-full px-4 py-1 border-b bg-background/80 backdrop-blur-md">
			<div className="container w-full flex h-17 items-center justify-between">
				<div className="flex items-center">
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/logo.svg"
							alt="Hammer Auction House Logo"
							className="dark:invert"
							width={60}
							height={60}
							style={{ objectFit: "contain" }}
						/>
						{/* <span className="text-lg font-bold text-foreground">Hammer Auction House</span> */}
						<span className="text-3xl font-bold text-primary">HAH!</span>
					</Link>
				</div>

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
						<Button
							size="sm"
							variant="outline"
							asChild
							className="hidden md:flex"
						>
							<Link href="/dashboard">Dashboard</Link>
						</Button>
					</div>
				</div>
			</header>
		);
}
