#!/usr/bin/env node
/**
 * Parse Awesome Internet Computer README for projects
 * Source: https://raw.githubusercontent.com/domwoe/awesome-internet-computer/main/README.md
 */

const AWESOME_README_URL = 'https://raw.githubusercontent.com/domwoe/awesome-internet-computer/main/README.md';

const SECTION_TO_CATEGORY = {
  'courses': 'tools',
  'tutorials': 'tools',
  'starters': 'tools',
  'client libraries': 'tools',
  'agents': 'tools',
  'cdks': 'tools',
  'motoko': 'tools',
  'candid': 'tools',
  'storage': 'tools',
  'databases': 'tools',
  'nfts': 'nft',
  'messaging': 'social',
  'defi': 'defi',
  'finance': 'defi',
  'dao': 'tools',
  'game': 'gaming',
  'gaming': 'gaming',
  'wallets': 'wallet',
  'authentication': 'wallet',
  'dashboards': 'tools',
  'explorers': 'tools',
  'registries': 'tools',
  'crosschain': 'tools',
  'blogs': 'social',
  'communities': 'social',
  'bounties': 'tools',
  'grants': 'tools'
};

function inferCategory(section) {
  const lower = (section || '').toLowerCase();
  for (const [key, cat] of Object.entries(SECTION_TO_CATEGORY)) {
    if (lower.includes(key)) return cat;
  }
  return 'tools';
}

function parseAwesomeReadme(text) {
  const projects = [];
  const lines = text.split('\n');
  let currentSection = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sectionMatch = line.match(/^## (.+)/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      continue;
    }
    const linkMatch = line.match(/^\s*-\s*\[([^\]]+)\]\(([^)]+)\)\s*-?\s*(.*)$/);
    if (linkMatch) {
      const [, name, url, desc] = linkMatch;
      if (!url || url.startsWith('#')) continue;
      let fullUrl = url.startsWith('http') ? url : `https://github.com/${url.replace(/^\//, '')}`;
      const category = inferCategory(currentSection);
      projects.push({
        name: name.trim(),
        description: (desc || name).trim().slice(0, 300),
        url: fullUrl,
        ecosystem: 'icp',
        categories: [category],
        tier: 2,
        logoUrl: '',
        source: 'awesome-internet-computer',
        createdAt: Date.now()
      });
    }
  }
  return projects;
}

async function fetchAwesome() {
  const res = await fetch(AWESOME_README_URL);
  const text = await res.text();
  return parseAwesomeReadme(text);
}

module.exports = { fetchAwesome, parseAwesomeReadme };

if (require.main === module) {
  fetchAwesome().then(p => {
    console.log(JSON.stringify(p, null, 2));
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
