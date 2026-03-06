# Bonsai Registry Monetization

The Bonsai Registry supports paid placements to generate revenue. Caffeine.ai can update `data/bonsai-registry-monetization.json` to add or remove projects.

## Tiers

| Tier | Price | Description |
|------|-------|-------------|
| **Featured** | $200-500/mo | Top placement in Featured section; elevated visibility |
| **Verified** | $50-100 (one-time or annual) | "Bonsai Verified" badge on listing |
| **Sponsored Section** | $300-1K/mo | Placement in named section (DeFi Spotlight, RWA Leaders, Creator Tools) |

## Data File

**Path:** `data/bonsai-registry-monetization.json`

### Structure

```json
{
  "featured": [
    {
      "url": "https://example.com/",
      "name": "Project Name",
      "description": "Short description for Featured card"
    }
  ],
  "verified": [
    "https://example.com/",
    "https://another-project.com/"
  ],
  "sponsoredSections": {
    "DeFi Spotlight": ["https://defi-project.com/"],
    "RWA Leaders": ["https://rwa-project.com/"],
    "Creator Tools": []
  }
}
```

### Adding a Project

1. **Featured:** Add object to `featured` array with `url`, `name`, `description`
2. **Verified:** Add URL string to `verified` array (must match link href in registry)
3. **Sponsored:** Add URL to appropriate key in `sponsoredSections`

### URL Matching

URLs are normalized (trailing slash, lowercase domain) for matching. The registry matches `link-item` hrefs against these URLs.
