#!/usr/bin/env node
/**
 * Deep Dive: Aggregate all ICP ecosystem data from multiple sources
 * Run: node scripts/deep-dive.js
 *
 * Sources: ICP Ecosystem, Awesome IC, DFINITY Blog, DGDG Collections, Grants
 * Output: Extends bonsai-registry-export with projects, news, nftCollections, etc.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXPORT_FILE = path.join(ROOT, 'bonsai-registry-export-2026-03-05.json');
const EXTENDED_FILE = path.join(ROOT, 'bonsai-registry-extended.json');

const icpEcosystem = require('./scrapers/icp-ecosystem');
const awesomeIc = require('./scrapers/awesome-ic');
const dfinityBlog = require('./scrapers/dfinity-blog');
const dgdgCollections = require('./scrapers/dgdg-collections');
const grants = require('./scrapers/grants');

function normalizeUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.origin + u.pathname.replace(/\/$/, '');
  } catch {
    return url;
  }
}

function dedupeProjects(projects) {
  const byUrl = new Map();
  const byName = new Map();
  for (const p of projects) {
    const url = normalizeUrl(p.url);
    const name = (p.name || '').toLowerCase().trim();
    const key = url || name;
    if (!key) continue;
    const existing = byUrl.get(url) || byName.get(name);
    if (existing) {
      if ((p.metrics || p.source) && !existing.metrics) Object.assign(existing, p);
      continue;
    }
    byUrl.set(url, p);
    byName.set(name, p);
  }
  return [...byUrl.values()];
}

async function runScrapers() {
  console.log('Fetching ICP Ecosystem...');
  const ecosystem = await icpEcosystem.fetchEcosystem().catch(e => {
    console.warn('ICP Ecosystem fetch failed:', e.message);
    return [];
  });

  console.log('Fetching Awesome Internet Computer...');
  const awesome = await awesomeIc.fetchAwesome().catch(e => {
    console.warn('Awesome IC fetch failed:', e.message);
    return [];
  });

  console.log('Fetching DFINITY Blog & News...');
  const news = await dfinityBlog.fetchAll().catch(e => {
    console.warn('DFINITY Blog fetch failed:', e.message);
    return [];
  });

  console.log('Fetching DGDG NFT Collections...');
  let collections = await dgdgCollections.fetchCollections().catch(() => []);
  if (collections.length === 0) collections = dgdgCollections.FALLBACK_COLLECTIONS;

  console.log('Fetching Grants data...');
  const grantProjects = await grants.fetchGrants().catch(e => {
    console.warn('Grants fetch failed:', e.message);
    return [];
  });

  return {
    ecosystem,
    awesome,
    news,
    collections,
    grantProjects
  };
}

function mergeIntoExtended(data) {
  const ecosystem = data.ecosystem || [];
  const awesome = (data.awesome || []).filter(a =>
    !ecosystem.some(e =>
      normalizeUrl(e.url) === normalizeUrl(a.url) ||
      e.name.toLowerCase() === a.name.toLowerCase()
    )
  );
  const grantProjects = (data.grantProjects || []).filter(g => g.url || g.name);
  const allProjects = dedupeProjects([...ecosystem, ...awesome, ...grantProjects]);

  const extended = {
    version: '2.0',
    lastUpdated: new Date().toISOString(),
    projects: allProjects.map((p, i) => ({
      id: i + 1,
      ...p,
      categories: p.categories || ['tools']
    })),
    news: (data.news || []).map((n, i) => ({ id: i + 1, ...n })),
    nftCollections: (data.collections || []).map((c, i) => ({ id: i + 1, ...c })),
    stats: {
      projects: allProjects.length,
      news: (data.news || []).length,
      nftCollections: (data.collections || []).length,
      sources: ['icp-ecosystem', 'awesome-internet-computer', 'dfinity-blog', 'dgdg', 'grants']
    }
  };

  return extended;
}

async function main() {
  const data = await runScrapers();

  const extended = mergeIntoExtended(data, null);
  fs.writeFileSync(EXTENDED_FILE, JSON.stringify(extended, null, 2), 'utf8');
  console.log(`\nWrote extended registry to ${path.basename(EXTENDED_FILE)}`);
  console.log(`  Projects: ${extended.stats.projects}`);
  console.log(`  News: ${extended.stats.news}`);
  console.log(`  NFT Collections: ${extended.stats.nftCollections}`);

  console.log('\nNote: bonsai-registry-export stays in sync with index.html via npm run sync-export');
  console.log('Extended data (news, scraped projects, NFT collections) is in bonsai-registry-extended.json');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
