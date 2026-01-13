# Veritas Protocol Architecture Document

## Project Overview
The Veritas Protocol aims to establish a decentralized publishing flow leveraging blockchain technology. This document outlines the core architectural decisions made for its development.

## Root Folder Name
`veritas-journal/`

## Core Architectural Decisions

### 1. Blockchain Network
*   **Choice:** Arbitrum (EVM-compatible Layer 2)
*   **Rationale:** Chosen for its high-throughput, low-cost transaction environment within the EVM ecosystem.

### 2. Smart Contracts
*   **Immutability:** Immutable
*   **Rationale:** To ensure maximum trust and credibility; once deployed, the core logic cannot be changed, aligning with the "Veritas" (truth) principle.
*   **Framework:** Hardhat (for development, testing, and deployment).

### 3. Decentralized Storage
*   **Choice:** IPFS (InterPlanetary File System)
*   **Rationale:** For decentralized and censorship-resistant storage of article content and metadata. Requires a pinning strategy for persistence.

### 4. On-Chain Asset (Articles)
*   **Choice:** ERC-721 Non-Fungible Token (NFT)
*   **Rationale:** Each published article will be represented as a unique, ownable, and transferable NFT, providing on-chain provenance and identity.

### 5. On-Chain Asset (Utility/Governance)
*   **Choice:** ERC-20 Fungible Token
*   **Rationale:** To facilitate staking and voting mechanisms within the Veritas Protocol.

### 6. Oracle Solution
*   **Choice:** Chainlink
*   **Rationale:** To securely and reliably bring verifiable real-world "Case Review Data" onto the blockchain, enabling smart contracts to interact with external information.

### 7. Data Encoding (IPFS CIDs in Smart Contracts)
*   **Choice:** Store CIDs as `string`
*   **Rationale:** Provides simplicity, robustness, and future-compatibility for variable-length IPFS CIDs, crucial for immutable contracts.

## Key User Flows

### 1. User Publishing an Article
1.  **Frontend (Next.js):** User composes/uploads article content and details.
2.  **Frontend (Next.js):** The article content is uploaded to NFT.Storage via a secure Next.js API route. An IPFS Content CID is returned.
3.  **Frontend (Next.js):** Metadata (JSON, including the Content CID) is created and uploaded to NFT.Storage via a secure Next.js API route. An IPFS Metadata CID is returned.
4.  **Frontend (Next.js):** User initiates a transaction to mint a new ERC-721 token by calling the `mintArticle()` function on the `VeritasArticle.sol` smart contract. The Metadata CID (as a `string`) is passed as the `tokenURI`.
5.  **Blockchain (Arbitrum):** The transaction is processed, and a new ERC-721 NFT representing the article is minted and assigned to the user's wallet.

### 2. User Staking ERC-20 Tokens
1.  **Frontend (Next.js):** User specifies the amount of ERC-20 Veritas Tokens they wish to stake.
2.  **Frontend (Next.js):** User approves the `VeritasToken.sol` smart contract to spend the specified amount of their tokens (standard ERC-20 `approve()` call).
3.  **Frontend (Next.js):** User initiates a transaction to call the `stake()` function on the `VeritasToken.sol` smart contract with the desired amount.
4.  **Blockchain (Arbitrum):** The tokens are transferred to the staking contract, and the user's staking balance is updated.

### 3. User Voting with Staked Tokens
1.  **Frontend (Next.js):** User browses available proposals or "Case Review Data" for voting.
2.  **Frontend (Next.js):** User selects a proposal and their vote choice (e.g., "Yes," "No," "Abstain").
3.  **Frontend (Next.js):** User initiates a transaction to call the `vote()` function on the `VeritasToken.sol` smart contract with the proposal ID and their vote.
4.  **Blockchain (Arbitrum):** The vote is recorded, taking into account the user's staked token weight.

### 4. User Viewing/Reading an Article
1.  **Frontend (Next.js):** User navigates to an article's page.
2.  **Frontend (Next.js):** The `wagmi` client reads the `tokenURI()` from the `VeritasArticle.sol` contract for the specific NFT/article ID. This returns an `ipfs://<Metadata_CID>`.
3.  **Frontend (Next.js):** The `nft.storage` client (or direct HTTP request to gateway) resolves the `Metadata_CID` to fetch the metadata JSON file from an IPFS gateway.
4.  **Frontend (Next.js):** The metadata JSON is parsed to extract the article's Content CID (e.g., `ipfs://<Content_CID>`).
5.  **Frontend (Next.js):** The `nft.storage` client (or direct HTTP request to gateway) resolves the `Content_CID` to fetch and display the actual article content.

## Frontend (Next.js) Architecture

### 8. Frontend Framework
*   **Choice:** React with Next.js
*   **Rationale:** Chosen for its performance, SEO benefits, server-side rendering/static site generation capabilities, and robust ecosystem for Web3 integration.

### 9. Frontend Web3 Integration Library
*   **Choice:** `wagmi` with `RainbowKit`
*   **Rationale:** `wagmi` (React Hooks for Ethereum) for seamless smart contract interaction and wallet management; `RainbowKit` for a user-friendly and consistent wallet connection UI.

### 10. Frontend IPFS Interaction
*   **Service:** NFT.Storage
*   **Client Library:** `nft.storage` client library
*   **Rationale:** NFT.Storage provides a free, purpose-built pinning service for NFT data (including IPFS and Filecoin persistence). The official `nft.storage` client library offers the most direct and efficient way to interact with the service via secure Next.js API routes for uploads.

### 11. Frontend State Management
*   **Choice:** Zustand
*   **Rationale:** A lightweight, simple, and powerful state management solution that complements `wagmi` by efficiently managing global UI state without excessive boilerplate.

### 12. Frontend UI Component Library/Styling
*   **Choice:** Tailwind CSS
*   **Rationale:** Provides maximum design flexibility, allowing for a completely custom and unique user interface. It will likely be paired with a headless UI library (e.g., Headless UI or Radix Primitives) for accessible components.

### 13. Frontend Deployment Strategy
*   **Choice:** Vercel
*   **Rationale:** Offers the most optimized, seamless, and reliable deployment experience for Next.js applications, supporting all dynamic features out-of-the-box.

---

## High-Level Project Structure

```
veritas-journal/
├── packages/
│   ├── contracts/   (Hardhat Project for Solidity Smart Contracts)
│   │   ├── contracts/              (Solidity source files: e.g., VeritasArticle.sol, VeritasToken.sol)
│   │   ├── scripts/                (Deployment & interaction scripts)
│   │   ├── test/                   (Contract unit and integration tests)
│   │   └── hardhat.config.ts       (Hardhat configuration)
│   │
│   └── webapp/      (Next.js Frontend Application)
│       ├── app/                    (Next.js App Router for routes, layouts, pages, API routes)
│       │   ├── api/                (Server-side API routes, e.g., for secure NFT.Storage uploads)
│       │   └── (routes)/           (Page routes like /dashboard, /publish, /article/[id])
│       ├── components/             (Reusable React components styled with Tailwind CSS)
│       ├── lib/                    (Utility functions, wagmi client setup, IPFS helper functions)
│       ├── styles/
│       │   └── globals.css         (Tailwind CSS directives and global styles)
│       ├── public/                 (Static assets like images, fonts)
│       ├── tailwind.config.ts      (Tailwind CSS configuration)
│       ├── postcss.config.js       (PostCSS configuration for Tailwind)
│       └── next.config.js          (Next.js configuration)
│
├── package.json          (Root package.json for pnpm monorepo workspace)
└── pnpm-workspace.yaml   (pnpm workspace definition file)
```
