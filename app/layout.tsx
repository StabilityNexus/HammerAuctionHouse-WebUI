import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import { WalletProvider } from '@/providers/wallet-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HammerChain Auctions | Web3 Auction Platform',
  description: 'Premium decentralized auction platform for NFTs and digital assets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletProvider>
            <div className="flex min-h-screen flex-col items-center justify-center w-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}