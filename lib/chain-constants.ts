export interface ChainContracts {
  English: string;
  AllPay: string;
  Linear: string;
  Exponential: string;
  Logarithmic: string;
  Vickrey: string;
}

export const RANGE_LIMIT: Record<number, bigint> = {
  1: BigInt(0),
  61: BigInt(0),
  137: BigInt(0),
  56: BigInt(0),
  8453: BigInt(0),
  5115: BigInt(999),
  63: BigInt(10000000),
};

export const AUCTION_CONTRACTS: Record<number, ChainContracts> = {
  // Ethereum Mainnet
  1: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // Ethereum Classic
  61: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // Polygon
  137: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // BSC
  56: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // Base
  8453: {
    English: "0x...",
    AllPay: "0x...",
    Linear: "0x...",
    Exponential: "0x...",
    Logarithmic: "0x...",
    Vickrey: "0x...",
  },
  // ETC Testnet
  63: {
    English: "0x45faE5bfD2d28dF9dF3Dc32a29E58326AE6dA6e6",
    AllPay: "0x357C830BD548b730315682c816Bab3Ba94490a23",
    Linear: "0x43f19713A812cbBcbDF58F93270261EFb04047a9",
    Exponential: "0x76A5ef90eac5dd9B99F87470935c8bcDE7dd02B4",
    Logarithmic: "0xCDBaCcca9c5aD8845cB001D7D8d8D01996316B56",
    Vickrey: "0xD730e5cdd245856e49fc52493221701e2903cC98",
  },
  // Citera Testnet
  5115: {
    English: "0xb082b7D4734FD7aaCB13De6cf281f6E631fF219E",
    AllPay: "0x389DbA9d0f77fec16835C0BfBd2442A748681F80",
    Linear: "0x8972e8Fe7E263f146A972FFc24DD2Ac9D3251B08",
    Exponential: "0xc82016DDc188a024EeB0873007f75f5FC7Bc8d55",
    Logarithmic: "0xD0CC7d8CC2C369597a042772d22D3e84CE8d4D99",
    Vickrey: "0xEf5c73B00A263bA71c6318Ead9A345b1d61B3D0d",
  },
};
