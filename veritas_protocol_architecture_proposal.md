# Architectural Proposal: Veritas Protocol

**Date:** 2026-01-13
**Author:** Winston, BMAD Architect
**Status:** DRAFT

## 1. Core Principle

Leverage the blockchain as an immutable anchor for *proof* and *metadata*, while utilizing decentralized storage solutions for the raw article content itself. This aligns with the "unstoppable" and "credibility real" aspects of the Veritas Protocol.

## 2. System Components

### 2.1. On-Chain Components (The Anchor)

This layer ensures immutability, transparency, and provable integrity of key actions and content metadata.

*   **Technology:** A smart contract-enabled blockchain. A high-throughput, low-cost Layer 2 solution (e.g., Polygon, Arbitrum) or a scalable Layer 1 (e.g., Solana) is recommended to mitigate high gas fees.
*   **Data Stored On-Chain:**
    *   **Content Hash:** A unique cryptographic hash (e.g., SHA-256) of the article content.
    *   **Content Identifier (CID):** A pointer to the full content on the decentralized storage network (DSN).
    *   **Author Identity:** The journalist's pseudonymous wallet address.
    *   **Stake Data:** Records of staked "Trust Tokens" for each article.
    *   **Article Status:** Flags for `Published`, `Challenged`, `RuledMisleading`, `RuledAuthentic`.
    *   **Reputation Data:** All "Trust Token" vote transactions.
    *   **Case Review Data:** Records of challenge initiations, jury selections, and final verdicts.
    *   **Payment Data:** Records of automatic fund distributions.

### 2.2. Off-Chain Components (Decentralized Storage)

This layer provides censorship-resistant storage for large files (the articles themselves) at a fraction of the cost of on-chain storage.

*   **Technology:** A Decentralized Storage Network (DSN).
*   **Recommended Options:**
    *   **IPFS (InterPlanetary File System):** For content-addressable storage.
    *   **Arweave:** For permanent, immutable storage.
*   **Workflow:**
    1.  Journalist finalizes an article on their client application.
    2.  The client uploads the article content to the DSN (e.g., IPFS), receiving a unique CID.
    3.  The client generates a SHA-256 hash of the content.
    4.  The client initiates an on-chain transaction containing the CID, the content hash, and other metadata to be stored in the smart contract.

### 2.3. Client-Side Application

This is the user-facing interface (web or desktop app) for journalists and readers.

*   **Journalist Functions:**
    *   Write and manage articles.
    *   Interface with their crypto wallet to stake tokens and sign publishing transactions.
    *   View their "Trust Score" and earnings.
    *   Participate in "Case Review" juries.
*   **Reader Functions:**
    *   Browse and read articles.
    *   Interface with their crypto wallet to use "Trust Tokens" for voting.
    *   Initiate challenges against articles.
    *   Donate to the "Automatic Community Fund."
*   **Core Logic:**
    1.  The client queries the blockchain for article metadata (author, status, CID, etc.).
    2.  It uses the CID to fetch the full article content from the DSN.
    3.  (Optional but recommended) It can locally re-hash the fetched content and verify it against the hash stored on-chain to guarantee authenticity.

## 3. High-Level Data Flow

```
1. Journalist (Client App)
   |
   +--> Writes Article
   |
2. Client App
   |
   +--> Uploads content to DSN (IPFS/Arweave) --> Gets Content ID (CID)
   |
   +--> Submits On-Chain Transaction (to Smart Contract)
        - Stakes Tokens
        - Records CID, content hash, author address
   |
3. Reader (Client App)
   |
   +--> Queries Smart Contract --> Gets metadata & CID
   |
   +--> Fetches content from DSN (using CID)
   |
   +--> Renders Article for Reader
```

## 4. Key Architectural Considerations & Risks

*   **Gas Costs:** As noted previously, this is a major risk. The choice of a low-cost Layer 1 or Layer 2 blockchain is critical for the model's viability.
*   **DSN Permanence:** The choice of DSN impacts the "unstoppable" nature of the content. Arweave offers higher permanence guarantees than IPFS alone, which may be preferable.
*   **Client-Side Security:** The wallet integration on the client-side must be secure to protect users' funds and identities.
*   **Smart Contract Security:** The smart contracts are the heart of the system and must undergo rigorous auditing to prevent exploits that could compromise the staking, reputation, or payment systems.
*   **Scalability:** The system must be designed to handle a large volume of articles and votes without performance degradation or prohibitive cost increases.

This proposal outlines a robust, scalable, and cost-effective architecture that fulfills the core requirements of the Veritas Protocol product brief.
