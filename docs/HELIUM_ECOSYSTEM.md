# Helium Ecosystem — Deep Dive

**Last updated:** March 2026  
**Scope:** Helium Network — IoT (LoRaWAN), 5G/Mobile, hotspots, wallets, roaming, hardware

---

## Overview

The Bonsai Registry includes a comprehensive Helium ecosystem section covering the decentralized wireless network and its IoT, 5G, and mobile verticals. Helium is a people-powered network where hotspot operators earn HNT (and MOBILE for 5G) by providing coverage. The network migrated to Solana in April 2023; HNT and MOBILE are SPL tokens.

---

## Categories

### Core Protocol & Infrastructure
- **Helium Network** — Official protocol site, decentralized wireless
- **Helium Foundation** — Protocol governance, grants, ecosystem support
- **Nova Labs** — Helium Mobile operator, core technology (hellohelium.com)
- **Helium Documentation** — Developer docs, Console API, HPL SDK

### IoT Network (LoRaWAN)
- **Helium IoT Network** — LoRaWAN connectivity for IoT devices globally
- **Helium Console** — Device management, Data Credits, API
- **Particle (M-Series)** — Connected hardware with Helium LoRaWAN
- **SkyNet IoT** — LoRaWAN roaming, maritime IoT (Netherlands, Florida)
- **LoRaWAN Roaming** — Open integration for network servers

### 5G & Helium Mobile
- **Helium 5G** — CBRS small cells, MOBILE token rewards, Proof-of-Coverage
- **Helium Mobile** — MVNO powered by decentralized coverage (~100k subscribers)
- **Carrier Offload** — MNOs/MVNOs offload data to Helium (Passpoint/Hotspot 2.0)
- **Partners** — Dish (first major carrier), Telefónica (Mexico), GigSky, Baicells

### Explorers & Wallets
- **Helium World** — Network and hotspot explorer (explorer.helium.com)
- **Helium Planner** — Coverage planning (explorer.hellohelium.com/planner)
- **Helium Wallet** — HNT, MOBILE, Data Credits (heliumwallet.org)
- **Helium Hotspot App** — Hotspot management, wallet (iOS/Android)

### Hardware & Hotspot Vendors
- **Parley Labs** — 5G gateways (FreedomFi), LoRaWAN hotspots
- **FreedomFi** — 5G CBRS small cells
- **Cal Chip Connect** — Helium hotspot distributor
- **Nebra** — Indoor and outdoor IoT hotspots
- **Bobcat** — Helium hotspot manufacturer

### Roaming & Integration
- **SkyNet IoT** — Maritime, agricultural IoT roaming
- **Particle** — M-Series platform with Helium connectivity
- **Telefónica** — Helium Mobile hotspots in Mexico City, Oaxaca
- **Dish Network** — First major US carrier on Helium 5G

---

## Tokens

| Token | Use |
|-------|-----|
| HNT | Network governance, burned for Data Credits (IoT) |
| MOBILE | 5G hotspot rewards, Proof-of-Coverage |
| IOT | SubDAO token for IoT network |
| Data Credits (DC) | Pay for IoT data transfer (burn HNT) |

---

## Data Sources

- `data/helium-ecosystem.json` — Reference list for maintainers
- `index.html` — Source of truth (chain #17)
- `bonsai-registry-export-*.json` — Export for external apps

---

## Maintenance

- Keep URLs and descriptions current (Nova Labs: nova.xyz / hellohelium.com)
- Add new roaming partners and hardware vendors as they join
- Sync changes across `data/helium-ecosystem.json`, `index.html`, and export JSON
