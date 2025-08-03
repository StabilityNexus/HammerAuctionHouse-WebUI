<!-- Don't delete it -->
<div name="readme-top"></div>

<!-- Organization Logo -->
<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 16px;">
  <img alt="Stability Nexus" src="public/stability.svg" width="175">
  <img src="public/cross.svg" width="30" style="margin: 0;" />
  <img src="public/logo-white.svg" width="175" />
</div>

&nbsp;

<!-- Organization Name -->
<div align="center">

[![Static Badge](https://img.shields.io/badge/Stability_Nexus-/HAH-228B22?style=for-the-badge&labelColor=FFC517)](https://www.dummy-url.com/)

<!-- Correct deployed url to be added -->

</div>

<!-- Organization/Project Social Handles -->
<p align="center">
<!-- Telegram -->
<a href="https://t.me/StabilityNexus">
<img src="https://img.shields.io/badge/Telegram-black?style=flat&logo=telegram&logoColor=white&logoSize=auto&color=24A1DE" alt="Telegram Badge"/></a>
&nbsp;&nbsp;
<!-- X (formerly Twitter) -->
<a href="https://x.com/StabilityNexus">
<img src="https://img.shields.io/twitter/follow/StabilityNexus" alt="X (formerly Twitter) Badge"/></a>
&nbsp;&nbsp;
<!-- Discord -->
<a href="https://discord.gg/YzDKeEfWtS">
<img src="https://img.shields.io/discord/995968619034984528?style=flat&logo=discord&logoColor=white&logoSize=auto&label=Discord&labelColor=5865F2&color=57F287" alt="Discord Badge"/></a>
&nbsp;&nbsp;
<!-- Medium -->
<a href="https://news.stability.nexus/">
  <img src="https://img.shields.io/badge/Medium-black?style=flat&logo=medium&logoColor=black&logoSize=auto&color=white" alt="Medium Badge"></a>
&nbsp;&nbsp;
<!-- LinkedIn -->
<a href="https://linkedin.com/company/stability-nexus">
  <img src="https://img.shields.io/badge/LinkedIn-black?style=flat&logo=LinkedIn&logoColor=white&logoSize=auto&color=0A66C2" alt="LinkedIn Badge"></a>
&nbsp;&nbsp;
<!-- Youtube -->
<a href="https://www.youtube.com/@StabilityNexus">
  <img src="https://img.shields.io/youtube/channel/subscribers/UCZOG4YhFQdlGaLugr_e5BKw?style=flat&logo=youtube&logoColor=white&logoSize=auto&labelColor=FF0000&color=FF0000" alt="Youtube Badge"></a>
</p>

---

<div align="center">
<h1>A Modular Web3 Auction Platform with Multi-Protocol Support</h1>
</div>

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## About

<!-- Correct url to be added -->

[Hammer Auction House](https://www.dummy-url.com) is a decentralized auction platform that redefines digital asset trading on blockchain. Users can participate in a variety of auction types with full transparency and security provided by smart contracts.

---

## Key Features

- **Multiple Auction Types:** Supports English, Dutch, All-Pay and Vickrey auctions for both NFTs and ERC-20 tokens.
- **Smart Contract Security:** Trustless execution with on-chain validation and verifiable, immutable transactions.
- **NFT & Token Trading:** List, bid on, and win ERC-721 NFTs and ERC-20 tokens.
- **Wallet Integration:** Seamless MetaMask and Web3 wallet support.
- **Transparent History:** Fully on-chain transaction records and bid history.
- **Extensible Services:** Modular auction services interface to support future auction mechanisms.

---

## Tech Stack

**Frontend**

- Next.js 14+ (React)
- TypeScript
- TailwindCSS
- shadcn/ui

**Blockchain**

- Wagmi
- Solidity Smart Contracts
- Ethers.js
- Rainbow-Kit Wallet Integration

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- MetaMask or any other web3 wallet browser extension

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/StabilityNexus/HammerAuctionHouse-WebUI.git
cd HammerAuctionHouse-WebUI
```

#### 2. Install Dependencies

Using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

#### 3. Run the Development Server

Start the app locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

#### 4. Open your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## Smart Contracts

Smart contract code powering auction logic can be found at
**[HammerAuctionHouse-Solidity](https://github.com/Stability-Nexus/HammerAuctionHouse-Solidity)**.

Contracts implement support for English, Dutch, All-Pay and Vickrey auction variants. See the Solidity repo for deployment,and method references.

---

## Contributing

We welcome contributions of all kinds! To contribute:

1. Fork the repository and create your feature branch (`git checkout -b feature/AmazingFeature`).
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
3. Run the development workflow commands to ensure code quality:
   - `npm run format:write`
   - `npm run lint:fix`
   - `npm run typecheck`
4. Push your branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request for review.

If you encounter bugs, need help, or have feature requests:

- Please open an issue in this repository providing detailed information.
- Describe the problem clearly and include any relevant logs or screenshots.

We appreciate your feedback and contributions!
