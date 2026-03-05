#!/usr/bin/env node
/**
 * Merge bonsai-registry-extended.json into bonsai-registry-export JSON.
 * Run after: npm run deep-dive
 * Output format: [{ name, description, url, ecosystem, categories, tier, logoUrl }, ...]
 * Valid categories: gaming, nft, defi, wallet, exchange, social, tools, commerce
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXPORT_FILE = path.join(ROOT, 'bonsai-registry-export-2026-03-05.json');
const EXTENDED_FILE = path.join(ROOT, 'bonsai-registry-extended.json');

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
  if (!fs.existsSync(EXTENDED_FILE)) {
    console.error('Run npm run deep-dive first to generate bonsai-registry-extended.json');
    process.exit(1);
  }

  const current = JSON.parse(fs.readFileSync(EXPORT_FILE, 'utf8'));
  const extended = JSON.parse(fs.readFileSync(EXTENDED_FILE, 'utf8'));

  const projects = Array.isArray(current) ? current : (current.projects || []);
  const nonIcp = projects.filter(p => (p.ecosystem || '').toLowerCase() !== 'icp');
  const icpProjects = (extended.projects || []).map(toExportFormat);

  const output = [...nonIcp.map(toExportFormat), ...icpProjects];

  fs.writeFileSync(EXPORT_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Updated ${path.basename(EXPORT_FILE)}`);
  console.log(`  Projects: ${output.length}`);
}

main();
