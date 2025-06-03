import Link from "next/link";
import { Hammer } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Hammer className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">HammerChain</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium Web3 auctions platform. Transparent, secure, and user-friendly.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auctions" className="text-muted-foreground hover:text-foreground">Browse Auctions</Link></li>
              <li><Link href="/create" className="text-muted-foreground hover:text-foreground">Create Auction</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HammerChain Auctions. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Twitter</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Discord</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}