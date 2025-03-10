import Navbar from "@/components/ui/navbar"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { AppProvider } from "./context/AppContextProvider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HAH! - Hammer Auction House",
  description: "The first truly decentralized auction house on Ethereum",
  icons: {
    icon: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
