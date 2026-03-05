#!/usr/bin/env node
/**
 * Aggregate all news sources and write bonsai-registry-news.json
 * Run: node scripts/news-aggregator.js
 * Use with GitHub Actions for scheduled live-ish updates.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NEWS_FILE = path.join(ROOT, 'bonsai-registry-news.json');
const SCAM_FILE = path.join(ROOT, 'data', 'scam-alerts.json');

const newsFeeds = require('./scrapers/news-feeds');
const dfinityBlog = require('./scrapers/dfinity-blog');

async function run() {
  console.log('Fetching RSS feeds...');
  const rssItems = await newsFeeds.fetchAll().catch(() => []);

  console.log('Fetching DFINITY blog...');
  const blogItems = await dfinityBlog.fetchAll().catch(() => []);

  const blogFormatted = (blogItems || []).map(b => ({
    title: b.title,
    url: b.url,
    source: b.source || 'internetcomputer.org',
    ecosystem: 'icp',
    tags: b.tags || ['blog'],
    fetchedAt: Date.now()
  }));

  const seen = new Set();
  const merged = [];
  for (const n of [...rssItems, ...blogFormatted]) {
    const k = (n.url || n.title || '').toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(n);
  }
  merged.sort((a, b) => (b.fetchedAt || 0) - (a.fetchedAt || 0));

  let scamAlerts = [];
  if (fs.existsSync(SCAM_FILE)) {
    scamAlerts = JSON.parse(fs.readFileSync(SCAM_FILE, 'utf8'));
  }

  const output = {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    news: merged.slice(0, 50).map((n, i) => ({ id: i + 1, ...n })),
    scamAlerts: scamAlerts.map((a, i) => ({ id: i + 1, ...a })),
    stats: { newsCount: merged.length, scamCount: scamAlerts.length }
  };

  fs.writeFileSync(NEWS_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Wrote ${path.basename(NEWS_FILE)}`);
  console.log(`  News: ${output.stats.newsCount}`);
  console.log(`  Scam Alerts: ${output.stats.scamCount}`);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
