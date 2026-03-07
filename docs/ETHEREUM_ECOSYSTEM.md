# Ethereum Ecosystem — Deep Dive

**Last updated:** March 2025  
**Scope:** Ethereum L1 + all Layer 2 networks, DeFi, NFTs, RWA, bridges, infrastructure

---

## Overview

The Bonsai Registry includes a comprehensive Ethereum ecosystem section covering the mainnet and all major Layer 2 scaling solutions. Ethereum remains the largest smart contract platform by TVL, developer activity, and institutional adoption.

---

## Categories

### Core Protocol & Infrastructure
- **Ethereum.org** — Official protocol hub
- **Ethereum Layer 2 Hub** — L2 discovery and education
- **Etherscan** — Block explorer and API
- **Alchemy** — RPC, APIs, developer platform
- **Infura** — Node provider and RPC
- **The Graph** — Indexing and subgraphs

### Layer 2 Networks
| Network | Type | Key Features |
|---------|------|--------------|
| Arbitrum | Optimistic | Highest L2 TVL, DeFi depth |
| Optimism | Optimistic | Superchain, OP Stack |
| Base | Optimistic | Coinbase L2, consumer focus |
| zkSync Era | ZK Rollup | EVM-compatible ZK |
| Starknet | ZK Rollup | STARK proofs, Cairo |
| Linea | zkEVM | ConsenSys |
| Scroll | zkEVM | Native bytecode compatibility |
| Polygon zkEVM | zkEVM | Polygon ecosystem |
| Blast | Optimistic | Yield-bearing, Blur tie-in |
| Metis | Optimistic | DACs, DeFi |
| Taiko | zkEVM | Type-1 Ethereum equivalence |
| Immutable X | ZK | NFT and gaming L2 |

### DeFi
- **Uniswap** — Leading AMM
- **Aave** — Lending/borrowing, GHO
- **Lido** — Liquid staking (stETH)
- **Curve** — Stablecoin AMM
- **MakerDAO** — DAI, RWA backing
- **Compound** — Lending
- **1inch** — DEX aggregator
- **dYdX** — Perpetuals DEX
- **ether.fi** — Liquid staking, restaking
- **Kelp DAO** — Restaking, LRTs

### Bridges & Cross-Chain
- **Stargate** — LayerZero native bridge
- **Across** — Fast L2 bridge
- **LayerZero** — Omnichain messaging
- **Base Bridge** — Ethereum ↔ Base
- **Arbitrum Bridge** — Ethereum ↔ Arbitrum

### RWA (Real-World Assets)
- **Ondo Finance** — Tokenized treasuries (OUSG, USDY)
- **Centrifuge** — RWA tokenization, credit, invoices
- **Maker RWA** — DAI T-Bill backing

### NFT Marketplaces
- OpenSea, Blur, Foundation, Rarible, SuperRare, LooksRare

### Wallets
- MetaMask, Rainbow, Rabby, Coinbase Wallet, Thirdweb, Manifold

---

## Data Sources

- `data/ethereum-ecosystem.json` — Reference list for maintainers
- `index.html` — Source of truth (Tier 1, chain #2)
- `bonsai-registry-export-*.json` — Export for external apps

---

## Maintenance

To add or update Ethereum projects:
1. Edit the Ethereum section in `index.html` (search for `<!-- H3: 2. Ethereum (ETH)`).
2. Add link-items in the appropriate category subheader.
3. Run `npm run sync-export` if the export includes Ethereum from index (note: sync-export currently extracts ICP only; Ethereum entries are maintained manually in the export).
4. Update `data/ethereum-ecosystem.json` for reference.

---

*Part of the Bonsai Registry — curating the top 75 blockchain ecosystems*
