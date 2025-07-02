import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import { type Chain } from 'viem';

const mordor = {
  id: 63,
  name: 'Mordor',
  nativeCurrency: { name: 'Mordor Eth', symbol: 'METC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mordor.etccooperative.org'] }
  },
  blockExplorers: {
    default: { name: 'Mordor Explorer', url: 'https://etc-mordor.blockscout.com/' }
  }
} as const satisfies Chain;

// export const wagmi_config = createConfig({
//   chains: [mainnet, sepolia],
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//   },
// })

export const wagmi_config = getDefaultConfig({
  appName: 'HAH',
  projectId: '00aea9e5bb1721b907ad8ea20f354c6a',
  chains: [mainnet, polygon, optimism, arbitrum, base,mordor],
  // ssr: true, // If your dApp uses server side rendering (SSR)
});