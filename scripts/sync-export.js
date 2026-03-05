#!/usr/bin/env node
/**
 * Sync bonsai-registry-export JSON with index.html
 * Extracts ICP section link-items and updates the export file.
 * Run: node scripts/sync-export.js (or npm run sync-export)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_HTML = path.join(ROOT, 'index.html');
const EXPORT_GLOB = path.join(ROOT, 'bonsai-registry-export-*.json');

// Category subheader -> JSON categories array
const CATEGORY_MAP = {
  'Gaming & Metaverse dApps': ['gaming'],
  'SocialFi & Messaging': ['social'],
  'NFT Marketplaces & Communities': ['nft'],
  'Top ICP NFT Collections (via DGDG)': ['nft'],
  'Decentralized Exchanges (DEX/DeFi)': ['defi'],
  'Wallets & Authentication': ['wallet'],
  'Tools, Infrastructure & Developer Hub': ['tools'],
  'Community, Indie & Beyond DFINITY': ['tools', 'social']
};

function extractIcpHrefs(html) {
  const icpStart = html.indexOf('<!-- H3: 41. Internet Computer (ICP) -->');
  const icpEnd = html.indexOf('<!-- H3: 42. Arbitrum (ARB) -->');
  if (icpStart === -1 || icpEnd === -1) return [];
  
  const icpSection = html.slice(icpStart, icpEnd);
  const items = [];
  const subheaders = ['Gaming & Metaverse', 'SocialFi & Messaging', 'NFT Marketplaces', 'Top ICP NFT Collections', 'Decentralized Exchanges', 'Wallets & Authentication', 'Tools, Infrastructure', 'Community, Indie'];
  
  const linkItemRe = /<a[^>]*link-item[^>]*href="([^"]+)"[^>]*>[\s\S]*?<h4[^>]*>([^<]+)<\/h4>[\s\S]*?<p[^>]*>([^<]*)<\/p>/g;
  let m;
  while ((m = linkItemRe.exec(icpSection)) !== null) {
    const [, href, name, tags] = m;
    const pre = icpSection.slice(0, m.index);
    let lastHeader = '';
    for (const sh of subheaders) {
      if (pre.includes(sh)) lastHeader = sh;
    }
    let categories = ['tools'];
    if (lastHeader.includes('Gaming')) categories = ['gaming'];
    else if (lastHeader.includes('SocialFi')) categories = ['social'];
    else if (lastHeader.includes('NFT')) categories = ['nft'];
    else if (lastHeader.includes('Decentralized') || lastHeader.includes('DEX')) categories = ['defi'];
    else if (lastHeader.includes('Wallet')) categories = ['wallet'];
    const tagStr = (tags || '').toLowerCase();
    if (tagStr.includes('nft') && !categories.includes('nft')) categories.push('nft');
    if (tagStr.includes('gaming') && !categories.includes('gaming')) categories.push('gaming');
    if (tagStr.includes('defi') && !categories.includes('defi')) categories.push('defi');
    if (tagStr.includes('wallet') && !categories.includes('wallet')) categories.push('wallet');
    items.push({
      name: name.trim(),
      description: (tags || '').replace(/#/g, ' ').trim().slice(0, 200) || name.trim(),
      url: href,
      ecosystem: 'icp',
      categories: [...new Set(categories)],
      tier: 2,
      logoUrl: '',
      createdAt: Date.now()
    });
  }
  return items;
}

const VALID_CATEGORIES = new Set(['gaming', 'nft', 'defi', 'wallet', 'exchange', 'social', 'tools', 'commerce']);

function toExportFormat(p) {
  const cats = (p.categories || [])
    .map(c => (typeof c === 'string' ? c.toLowerCase() : c))
    .filter(c => c && VALID_CATEGORIES.has(c));
  return {
    name: p.name || '',
    description: p.description || p.name || '',
    url: p.url || '',
    ecosystem: (p.ecosystem || 'icp').toLowerCase(),
    categories: cats.length ? cats : ['tools'],
    tier: typeof p.tier === 'number' ? p.tier : 2,
    logoUrl: p.logoUrl || ''
  };
}

function main() {
  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  const icpItems = extractIcpHrefs(html);
  
  const exportFiles = fs.readdirSync(ROOT).filter(f => f.startsWith('bonsai-registry-export-') && f.endsWith('.json'));
  const exportFile = exportFiles.length ? path.join(ROOT, exportFiles[0]) : path.join(ROOT, 'bonsai-registry-export-2026-03-05.json');
  
  let projects = [];
  if (fs.existsSync(exportFile)) {
    const data = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
    projects = Array.isArray(data) ? data : (data.projects || []);
  }
  
  const nonIcp = projects.filter(p => (p.ecosystem || '').toLowerCase() !== 'icp');
  const icpFormatted = icpItems.map(p => toExportFormat(p));
  const output = [...nonIcp.map(toExportFormat), ...icpFormatted];
  
  fs.writeFileSync(exportFile, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Synced ${icpItems.length} ICP entries to ${path.basename(exportFile)}`);
}

main();
