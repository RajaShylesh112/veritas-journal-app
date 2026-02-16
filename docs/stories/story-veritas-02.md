# User Story: Markdown Editor & IPFS/NFT Minting Pipeline
**ID:** STORY-VERITAS-02
**Epic:** EPIC-VERITAS-001
**Status:** review

## Title
Implement the Markdown publishing flow to IPFS and Arbitrum.

## Problem Statement
As a journalist, I want to write an article and mint it as an NFT so that my work is permanently recorded and censorship-resistant.

## Acceptance Criteria
- [x] Markdown editor implemented in `/publish`.
- [x] Article content pins to IPFS via NFT.Storage.
- [x] Frontend triggers `mintArticle` transaction on Arbitrum Sepolia using the IPFS CID.
- [x] Transaction status (pending/success/fail) is clearly communicated to the user.

## Technical Context
- **Storage:** NFT.Storage (IPFS)
- **Editor:** `react-markdown`
- **Wagmi:** `useWriteContract` for minting

## Tasks/Subtasks
- [x] **Task 1: Setup Publishing UI**
  - [x] Create `/publish` route with dynamic client-side loading
  - [x] Implement Markdown editor with live preview
- [x] **Task 2: IPFS Integration**
  - [x] Implement lazy-loading for `nft.storage`
  - [x] Add logic to pin metadata and content to IPFS
- [x] **Task 3: Minting Pipeline**
  - [x] Connect frontend to `VeritasArticle` contract
  - [x] Implement transaction status tracking
- [x] **Task 4: Validation**
  - [x] Verify webapp build success (SSR compatibility)

## Dev Agent Record
### Debug Log
- [2026-02-16] Started STORY-VERITAS-02 implementation.
- [2026-02-16] Installed `react-markdown`, `nft.storage`, and `lucide-react`.
- [2026-02-16] Exported Contract ABI to `webapp/src/constants/VeritasArticle.ts`.
- [2026-02-16] Created `PublishComponent.tsx` with IPFS pinning and minting logic.
- [2026-02-16] Resolved `ReferenceError: indexedDB is not defined` build error by using dynamic imports and client-side checks.
- [2026-02-16] Updated `wagmi.ts` and `providers.tsx` for better SSR compatibility.
- [2026-02-16] Verified successful production build.

### Completion Notes
- **Publishing Flow:** Users can write in Markdown, preview their work, and publish. The process pins content to IPFS via NFT.Storage before triggering the blockchain transaction.
- **SSR Compatibility:** Addressed significant issues with Web3 libraries attempting to access browser APIs (`indexedDB`) during the Next.js build phase.
- **Environment Variables:** `NEXT_PUBLIC_NFT_STORAGE_TOKEN` is required for IPFS uploads.

## File List
- `veritas-journal/webapp/src/app/publish/page.tsx`
- `veritas-journal/webapp/src/components/PublishComponent.tsx`
- `veritas-journal/webapp/src/constants/VeritasArticle.ts`
- `veritas-journal/webapp/src/wagmi.ts`
- `veritas-journal/webapp/src/app/providers.tsx`
- `veritas-journal/webapp/src/components/Header.tsx`

## Status
review
