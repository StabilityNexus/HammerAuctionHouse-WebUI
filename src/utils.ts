import { ethers } from "ethers";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    ethereum: any;
  }
}

export function formatTimeLeft(endTime: Date): string {
  const diff = endTime.getTime() - Date.now();
  // console.log(Date.now());
  // console.log(endTime.getTime());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

export async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      return { address, signer };
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  } else {
    alert("MetaMask is not installed!");
  }
}

export const handleError = (
  error: any,
  fallbackMessage: string = "An error occurred"
) => {
  console.error("Full error object:", error); // Debugging

  let errorMessage = fallbackMessage;
  if (error?.data?.message) {
    errorMessage = error.data.message;
  } else if (error?.revert?.args?.length > 0) {
    errorMessage = error.revert.args[0];
  } else if (error?.reason) {
    errorMessage = error.reason;
  }

  toast.error(errorMessage);
  console.error(error);
};
