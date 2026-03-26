import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  base,
} from 'wagmi/chains';
import { createConfig, http } from 'wagmi';
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

const citrea_testnet = {
  id: 5115,
  name: 'Citrea Testnet',
  nativeCurrency: { name: 'Citrea Eth', symbol: 'CBTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.citrea.xyz'] }
  },
  blockExplorers: {
    default: { name: 'Citrea Explorer', url: 'https://explorer.testnet.citrea.xyz/' }
  }
} as const satisfies Chain;

const chains = [mordor, citrea_testnet, mainnet, polygon, base] as const;

const makeServerConfig = () =>
  createConfig({
    chains,
    transports: {
      [mordor.id]: http(mordor.rpcUrls.default.http[0]),
      [citrea_testnet.id]: http(citrea_testnet.rpcUrls.default.http[0]),
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [base.id]: http(),
    },
    ssr: true,
  });

export const wagmi_config =
  typeof window === 'undefined'
    ? makeServerConfig()
    : getDefaultConfig({
        appName: 'HAH',
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
        chains,
        ssr: true,
      });
