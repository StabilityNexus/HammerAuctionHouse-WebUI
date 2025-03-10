"use client"

import { AppContextType } from "@/lib/types"
import { createContext, useContext, useState } from "react"

const AppContext = createContext<AppContextType>({
  account: "",
  setAccount: () => {},
  connected: false,
  setConnected: () => {},
  signer: null,
  setSigner: () => {},
  auctionClient: null,
  setAuctionClient: () => {},
})

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState("")
  const [connected, setConnected] = useState(false)
  const [signer, setSigner] = useState<any>(null)
  const [auctionClient, setAuctionClient] = useState<any>(null)

  return (
    <AppContext.Provider
      value={{
        account,
        setAccount,
        connected,
        setConnected,
        signer,
        setSigner,
        auctionClient,
        setAuctionClient,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useAppContext() {
  return useContext(AppContext)
}
