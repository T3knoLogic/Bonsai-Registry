# Bonsai Registry: Deep Dive & Live News Proposal

## Part 1: Deep Deep Dive — Expanded Data Collection

### Target Categories & Data Sources

| Category | Sources | Notes |
|----------|---------|------|
| **Projects/dApps** | ICP Ecosystem, Awesome IC, cyql.io, Canlista, DSCVR portals | Already partially built |
| **Artists** | NyanNyanStudio, Kontribute creators, Entrepot/DGDG collection curators, Origyn art partners | Manual curation + scraping creator pages |
| **Developers/Builder** | GitHub (dfinity, Toniq-Labs, Psychedelic, Demergent Labs, rocklabs, ICPSwap), Forum contributors, Grant recipients | GitHub API, forum RSS |
| **DeFi** | ICPSwap, Sonic, ICDex, Infinity Swap, Finterest, Funded, KongSwap | Extend ecosystem scraper |
| **NFTs** | DGDG, Entrepot, Yumi collections; ICRC7/ICRC37 (Origyn) | Already have DGDG curated list |
| **Software/Tools** | Azle, Kybra, Motoko Playground, Fleek, ICPipeline | Awesome IC + ecosystem |
| **Commerce** | Enchanted Bonsai Bazaar, Origyn luxury, NFT + physical stores | Manual add + Origyn partners |
| **RWA / Fine Art** | Origyn, luxury authentication, art galleries using ICP | Origyn blog, partnership announcements |
| **Galleries** | Origyn-certified galleries, Entrepot art collections | Limited public data |
| **Musicians** | ITOKA, Bonsai Radio (ICP streaming), music NFT creators | ITOKA ecosystem, manual curation |
| **Influencers** | ICP Twitter/X accounts, DSCVR portal admins, YouTube educators | Twitter API / manual list; DSCVR if API exists |
| **Scam Watch** | DFINITY Forum (Security, General), DFINITY blog advisories, community Discord | Forum RSS, blog scrape; manual verified list |

### Proposed Schema Extensions

```json
{
  "entityType": "project|person|collection|news|alert",
  "categories": ["gaming","nft","defi","wallet","exchange","social","tools","commerce","rwa","art","music","scam-alert"]
}
```

**New entity types:**
- `person` — artists, developers, influencers (name, role, url, projectIds)
- `alert` — scam/phishing warnings (title, url, severity, source, publishedAt)

**New categories:** `rwa`, `art`, `music`, `scam-alert`

### Implementation Phases

1. **Phase 1 (Quick wins)** — Add scrapers for: Forum DFINITY RSS (governance + general), Origyn blog, ITOKA/Itoka
2. **Phase 2** — GitHub org scraper for top ICP repos/contributors
3. **Phase 3** — Curated manual lists: artists, musicians, influencers, scam-alert (export to JSON)
4. **Phase 4** — cyql.io / Canlista API if available; DSCVR API if documented

---

## Part 2: Live News Updates — Architecture Options

### Option A: Static JSON + Scheduled Build (Simplest)

**How it works:** GitHub Actions runs `npm run deep-dive` + news scraper every 1–6 hours. Output is committed or stored as artifact. Frontend fetches `news.json` on load and on a refresh button.

**Pros:** No backend, no real-time infra, works with static hosting  
**Cons:** Not real-time; delay = cron interval

**Implementation:**
```
.github/workflows/news-update.yml
  - Schedule: every 2 hours
  - Runs: node scripts/scrapers/news-aggregator.js
  - Output: news.json (or updates bonsai-registry-extended.json)
```

---

### Option B: Client-Side Polling

**How it works:** Frontend fetches `news.json` (or `/api/news`) every 30–60 seconds when the tab is active. Backend can be static JSON or a minimal server.

**Pros:** Simple, works with static hosting if JSON is pre-built  
**Cons:** Higher request volume; still limited by how often the JSON is rebuilt

**Implementation:**
```javascript
// Frontend: fetch on mount + setInterval
const NEWS_URL = '/bonsai-registry-news.json';
setInterval(() => fetch(NEWS_URL).then(r => r.json()).then(setNews), 60000);
```

---

### Option C: RSS Aggregation Service

**How it works:** Standalone service subscribes to RSS feeds (DFINITY blog, Medium, Forum, Origyn, etc.), normalizes items, and exposes a REST or SSE endpoint.

**Sources:**
- `https://forum.dfinity.org/c/general/7.rss` (if available)
- Medium.com/dfinity (RSS: `https://medium.com/feed/@dfinity`)
- internetcomputer.org/blog (check for RSS/Atom)
- Origyn Medium, ITOKA blog

**Pros:** Real RSS; can run on a small server or serverless  
**Cons:** Needs a backend service to aggregate

---

### Option D: Server-Sent Events (SSE)

**How it works:** Backend maintains connections to sources (RSS, APIs) and pushes new items to clients via SSE when they arrive.

**Pros:** Real-time push, no client polling  
**Cons:** Requires persistent backend; more complex

---

### Option E: Third-Party News API

**How it works:** Use CryptoPanic, NewsAPI, or similar, filtered for "Internet Computer" / "ICP".

**Pros:** Rich, maintained news stream  
**Cons:** API key, cost, may have limited ICP coverage

---

## Recommended Approach: Hybrid

1. **Short term**
   - Add **RSS/feed scraper** for: Medium/dfinity, Forum (if RSS exists), Origyn blog
   - Output to `bonsai-registry-news.json` in the repo
   - **GitHub Actions** runs every 2–4 hours
   - Frontend shows a “News” section with a “Refresh” button that refetches the JSON

2. **Medium term**
   - Deploy a small **RSS aggregator** (e.g. Vercel/Cloudflare Worker) that:
     - Polls feeds every 15–30 min
     - Merges and deduplicates
     - Serves `GET /api/news` or static `news.json`
   - Frontend polls every 60 seconds when the News section is visible

3. **Long term**
   - Add **Scam Alerts** as a separate feed from Forum + manual curation
   - Optional: WebSocket/SSE for true push if traffic justifies it

---

## Implementation Status

| Item | Status |
|------|--------|
| RSS news scraper (`news-feeds.js`) | ✅ Done — Medium, Forum feeds |
| News aggregator (`news-aggregator.js`) | ✅ Done — merges feeds → bonsai-registry-news.json |
| Scam alerts (`data/scam-alerts.json`) | ✅ Done — curated list |
| Curated people (`data/curated-people.json`) | ✅ Done — artists, musicians, developers |
| RWA / fine art (`data/rwa-fine-art.json`) | ✅ Done — ORIGYN etc. |
| GitHub Actions (every 4h) | ✅ Done — `.github/workflows/news-update.yml` |
| Frontend news display | 🔲 Pending |

### Run locally

```bash
npm run news   # Fetches RSS + blog → bonsai-registry-news.json
```

### Live update flow

1. GitHub Actions runs every 4 hours
2. Updates `bonsai-registry-news.json`, commits and pushes
3. Frontend fetches `bonsai-registry-news.json` on load + refresh button (or poll every 60s)

---

## Next Steps

1. Update frontend (index.html) to display news + scam alerts section
2. Extend deep-dive to merge `data/curated-people.json`, `data/rwa-fine-art.json`, `data/scam-alerts.json` into extended export
3. Add Discourse forum scraper for scam-alert automation (parse Security/General for "scam", "phishing", "alert")
