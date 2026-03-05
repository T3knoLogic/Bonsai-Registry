#!/usr/bin/env node
/**
 * Scrape DGDG.app NFT collections list
 * Source: https://dgdg.app/nfts (collections index)
 */

const DGDG_BASE = 'https://dgdg.app';

async function fetchCollections() {
  const url = `${DGDG_BASE}/nfts`;
  const res = await fetch(url, { headers: { 'User-Agent': 'BonsaiRegistry/1.0' } });
  const html = await res.text();
  const collections = [];
  const linkRe = /href="(\/nfts\/collections\/[^"]+)"[^>]*>([^<]+)</g;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    const [, path, name] = m;
    if (path && name && name.length > 2 && !name.includes('Select') && !name.includes('Filter')) {
      const slug = path.replace('/nfts/collections/', '');
      collections.push({
        name: name.trim(),
        slug,
        url: `${DGDG_BASE}${path}`,
        ecosystem: 'icp',
        categories: ['nft'],
        marketplace: 'dgdg',
        source: 'dgdg-app',
        createdAt: Date.now()
      });
    }
  }
  const slugRe = /\/nfts\/collections\/([a-z0-9_]+)/g;
  while ((m = slugRe.exec(html)) !== null) {
    const slug = m[1];
    if (slug && !collections.some(c => c.slug === slug)) {
      collections.push({
        name: slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        slug,
        url: `${DGDG_BASE}/nfts/collections/${slug}`,
        ecosystem: 'icp',
        categories: ['nft'],
        marketplace: 'dgdg',
        source: 'dgdg-app',
        createdAt: Date.now()
      });
    }
  }
  const seen = new Set();
  return collections.filter(c => {
    const k = c.slug;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Known collections from DGDG / Entrepot (fallback if scrape fails)
const FALLBACK_COLLECTIONS = [
  { name: 'Motoko Ghosts', slug: 'motokos', url: 'https://dgdg.app/nfts/collections/motokos' },
  { name: 'BTC Flower Gen 2.0', slug: 'flowers_v2', url: 'https://dgdg.app/nfts/collections/flowers_v2' },
  { name: 'Pet Bots', slug: 'pet_bots', url: 'https://dgdg.app/nfts/collections/pet_bots' },
  { name: 'ICP Punks', slug: 'icp_punks', url: 'https://dgdg.app/nfts/collections/icp_punks' },
  { name: 'IC Bucks', slug: 'bucks', url: 'https://dgdg.app/nfts/collections/bucks' },
  { name: 'Poked Bots', slug: 'poked', url: 'https://dgdg.app/nfts/collections/poked' },
  { name: 'Cronic', slug: 'cronic', url: 'https://dgdg.app/nfts/collections/cronic' },
  { name: 'Cubetopia Worlds', slug: 'cubetopia', url: 'https://dgdg.app/nfts/collections/cubetopia' },
  { name: 'Portal', slug: 'portal', url: 'https://dgdg.app/nfts/collections/portal' },
  { name: 'ICPics', slug: 'icpics', url: 'https://dgdg.app/nfts/collections/icpics' },
  { name: 'Crypto 90s', slug: 'crypto90s', url: 'https://dgdg.app/nfts/collections/crypto90s' },
  { name: 'IC Moji', slug: 'icmoji', url: 'https://dgdg.app/nfts/collections/icmoji' },
  { name: 'Pineapple Punks', slug: 'pineapple_punks', url: 'https://dgdg.app/nfts/collections/pineapple_punks' },
  { name: 'Wrapped DC', slug: 'wdc', url: 'https://dgdg.app/nfts/collections/wdc' },
  { name: 'Mechs', slug: 'mechs', url: 'https://dgdg.app/nfts/collections/mechs' },
  { name: 'CAP Crowns', slug: 'cap_crowns', url: 'https://dgdg.app/nfts/collections/cap_crowns' },
  { name: 'Azumi', slug: 'azumi', url: 'https://dgdg.app/nfts/collections/azumi' }
].map(c => ({ ...c, ecosystem: 'icp', categories: ['nft'], marketplace: 'dgdg', source: 'dgdg-curated', createdAt: Date.now() }));

module.exports = { fetchCollections, FALLBACK_COLLECTIONS };

if (require.main === module) {
  fetchCollections()
    .then(c => {
      const out = c.length > 0 ? c : FALLBACK_COLLECTIONS;
      console.log(JSON.stringify(out, null, 2));
    })
    .catch(() => {
      console.log(JSON.stringify(FALLBACK_COLLECTIONS, null, 2));
    });
}
