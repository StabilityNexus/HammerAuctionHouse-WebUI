import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "../components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hammer Auction House",
  description:
    "Premium decentralized auction platform for NFTs and digital assets",
  icons: {
    icon: "/logo.svg",
  },
};

/**
 * Root layout component that defines the global structure, theming, and providers for the application.
 *
 * Wraps the main content with navigation, footer, theme management, and global providers, ensuring consistent layout and styling across all pages.
 *
 * @param children - The page content to be rendered within the layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <div className="flex min-h-screen flex-col items-center justify-center w-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
