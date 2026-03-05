#!/usr/bin/env node
/**
 * Scrape ICP Ecosystem page (official 82 projects)
 * Source: https://hwvjt-wqaaa-aaaam-qadra-cai.ic0.app/ecosystem
 */

const CATEGORY_KEYWORDS = {
  social: ['social', 'messaging', 'chat', 'blog', 'twitter', 'youtube', 'content', 'creator', 'community'],
  nft: ['nft', 'marketplace', 'collectible', '3d', 'art', 'mint'],
  defi: ['dex', 'swap', 'lending', 'borrow', 'tvl', 'funded', 'crowdfund', 'token'],
  wallet: ['wallet', 'plug', 'stoic', 'identity', 'auth'],
  gaming: ['game', 'metaverse', 'play', 'battle', 'rpg'],
  tools: ['tool', 'cli', 'ide', 'dashboard', 'explorer', 'registry', 'developer']
};

function inferCategory(name, description) {
  const text = `${(name || '').toLowerCase()} ${(description || '').toLowerCase()}`;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) return cat;
  }
  return 'tools';
}

function parseFromMarkdown(text) {
  const blocks = text.split(/(?=### )/);
  const projects = [];
  for (const block of blocks) {
    if (!block.trim().startsWith('### ')) continue;
    const nameMatch = block.match(/^### ([^\n]+)/);
    if (!nameMatch) continue;
    let name = nameMatch[1].replace(/\s*Uses Internet Identity\s*/i, '').trim();
    const tryItMatch = block.match(/\[Try it\]\(([^)]+)\)/);
    if (!tryItMatch) continue;
    const url = tryItMatch[1];
    const lines = block.split('\n').filter(l => l.trim());
    let description = '';
    let metrics = {};
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('### ') || line.startsWith('[Try it]')) continue;
      if (/^\$[\d,.]+[MK]?\s*(Invested|Raised|TVL)/i.test(line) || /\d[\d,]*\+?\s*(users|searches|videos|minutes|ICP|websites)/i.test(line) || /Working MVP|Thriving community|Supports ckBTC/i.test(line)) {
        metrics.raw = line.trim();
        continue;
      }
      if (line.length > 20) description = (description ? description + ' ' : '') + line.trim();
    }
    const category = inferCategory(name, description);
    projects.push({
      name,
      description: description.slice(0, 300) || name,
      url,
      ecosystem: 'icp',
      categories: [category],
      tier: 2,
      logoUrl: '',
      metrics: Object.keys(metrics).length ? metrics : undefined,
      source: 'icp-ecosystem-official',
      createdAt: Date.now()
    });
  }
  return projects;
}

function parseFromHtml(html) {
  const projects = [];
  const cardRe = /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<h3[^>]*>([^<]+)<\/h3>[\s\S]*?<p[^>]*>([^<]*)<\/p>/gi;
  let m;
  while ((m = cardRe.exec(html)) !== null) {
    const [, url, name, desc] = m;
    const cleanName = (name || '').replace(/\s*Uses Internet Identity\s*/i, '').trim();
    if (url && cleanName && (url.startsWith('http') || url.startsWith('/'))) {
      const fullUrl = url.startsWith('http') ? url : `https://hwvjt-wqaaa-aaaam-qadra-cai.ic0.app${url}`;
      projects.push({
        name: cleanName,
        description: (desc || cleanName).trim().slice(0, 300),
        url: fullUrl,
        ecosystem: 'icp',
        categories: [inferCategory(cleanName, desc)],
        tier: 2,
        logoUrl: '',
        source: 'icp-ecosystem-official',
        createdAt: Date.now()
      });
    }
  }
  const linkRe = /<a[^>]+href="(https:\/\/[^"]+)"[^>]*>[\s\S]*?Try it[\s\S]*?<\/a>/gi;
  const seen = new Set(projects.map(p => p.url));
  while ((m = linkRe.exec(html)) !== null) {
    const url = m[1];
    if (seen.has(url)) continue;
    const prev = html.slice(0, m.index);
    const h3Match = prev.match(/<h3[^>]*>([^<]+)<\/h3>(?=[\s\S]*$)/);
    const name = h3Match ? h3Match[1].replace(/\s*Uses Internet Identity\s*/i, '').trim() : 'ICP Project';
    seen.add(url);
    projects.push({
      name,
      description: name,
      url,
      ecosystem: 'icp',
      categories: ['tools'],
      tier: 2,
      logoUrl: '',
      source: 'icp-ecosystem-official',
      createdAt: Date.now()
    });
  }
  return projects;
}

function parseEcosystemContent(text) {
  const md = parseFromMarkdown(text);
  if (md.length > 0) return md;
  return parseFromHtml(text);
}

async function fetchEcosystem() {
  const url = 'https://hwvjt-wqaaa-aaaam-qadra-cai.ic0.app/ecosystem';
  const res = await fetch(url, { headers: { 'Accept': 'text/html,text/plain' } });
  const text = await res.text();
  return parseEcosystemContent(text);
}

module.exports = { fetchEcosystem, parseEcosystemContent };

if (require.main === module) {
  fetchEcosystem().then(p => {
    console.log(JSON.stringify(p, null, 2));
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
