# Bonsai Registry

A decentralized registry for bonsai tree NFTs and related digital assets on the Internet Computer (IC) network.

## Overview

The Bonsai Registry serves as a comprehensive catalog and management system for bonsai tree collections, NFT metadata, and associated digital assets within the Enchanted Bonsai Bazaar ecosystem.

## Features

- **NFT Registry**: Centralized catalog of all bonsai tree NFTs
- **Metadata Management**: Standardized metadata storage and retrieval
- **Asset Tracking**: Digital asset provenance and ownership tracking
- **Search & Discovery**: Advanced search capabilities for bonsai collections
- **Integration Ready**: Built for seamless integration with OISY Wallet and Internet Identity

## Technology Stack

- **Backend**: Motoko (Internet Computer)
- **Frontend**: Modern JavaScript framework
- **Authentication**: Internet Identity (II)
- **Wallet Integration**: OISY Wallet
- **Deployment**: DFINITY dfx

## Project Structure

```
bonsai-registry/
├── backend/          # Motoko canister code
├── frontend/         # Frontend application
├── docs/            # Documentation
├── scripts/         # Deployment and utility scripts
└── README.md        # This file
```

## Registry Export & Sync

The `index.html` registry (especially the ICP section) is the source of truth. To keep `bonsai-registry-export-2026-03-05.json` in sync for import into your application, run:

```bash
npm run sync-export
```

Run this after any changes to the ICP section in `index.html`.

## Deep Dive: Comprehensive ICP Ecosystem Data

For a comprehensive scrape of ICP projects, news, NFT collections, and more, run:

```bash
npm run deep-dive
```

This aggregates data from:
- **ICP Ecosystem** (official 82+ dApps)
- **Awesome Internet Computer** (GitHub curated list)
- **DFINITY Blog & News** (announcements, partnerships)
- **DGDG NFT Collections** (curated list)
- **Developer Grants** (grant recipients)

Output: `bonsai-registry-extended.json` with projects, news, and nftCollections for import into your application.

## Monetization

The registry supports paid placements (Featured, Verified, Sponsored sections). Edit `data/bonsai-registry-monetization.json` to add or remove projects. Caffeine.ai can update this file via Git. See [docs/MONETIZATION.md](docs/MONETIZATION.md) for structure and pricing.

## Getting Started

*Coming soon - development setup instructions will be added as the project develops.*

## License

All Rights Reserved T3kNo-Logic 2025

---

*Part of the Enchanted Bonsai Bazaar ecosystem*
