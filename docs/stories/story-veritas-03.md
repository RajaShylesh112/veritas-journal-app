# User Story: Credibility Feed & Signature-Based Trust Signals
**ID:** STORY-VERITAS-03
**Epic:** EPIC-VERITAS-001
**Status:** TODO

## Title
Build the article feed and gasless community trust signaling.

## Problem Statement
As a reader, I want to see a feed of articles and signal my trust in them without paying gas, so I can help curate high-integrity journalism.

## Acceptance Criteria
- [ ] Main feed `/` fetches article NFTs from the contract.
- [ ] Feed displays article content from IPFS.
- [ ] "Trust" button triggers a Web3 signature (`signMessage`).
- [ ] Signature and trust signal stored in Supabase `trust_signals` table.
- [ ] Feed displays cumulative "Trust Score" for each article.

## Technical Context
- **Database:** Supabase (PostgreSQL)
- **Signature:** `viem.verifyMessage` for backend validation
- **Contract:** `useReadContract` for fetching minted Article IDs
