#!/usr/bin/env node
/**
 * Fetch ICP news from RSS feeds and blog sources.
 * Feeds: Medium/dfinity, Forum DFINITY (Discourse RSS)
 * Output: Merged, deduplicated news items for live-ish updates.
 */

const FEEDS = [
  { url: 'https://medium.com/feed/@dfinity', source: 'medium.com/dfinity', tag: 'blog' },
  { url: 'https://forum.dfinity.org/latest.rss', source: 'forum.dfinity.org', tag: 'community' },
  { url: 'https://forum.dfinity.org/c/developers/6.rss', source: 'forum.dfinity.org', tag: 'developers' },
  { url: 'https://forum.dfinity.org/c/general/7.rss', source: 'forum.dfinity.org', tag: 'general' }
];

async function fetchRss(url) {
  const res = await fetch(url, { headers: { 'Accept': 'application/rss+xml, application/xml, text/xml' } });
  const xml = await res.text();
  return parseRssXml(xml);
}

function parseRssXml(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || block.match(/<title>([^<]+)</)?.[1] || '';
    const link = block.match(/<link[^>]*>([^<]+)<\/link>|<\/guid>[^<]*<link>([^<]+)</)?.[1] || block.match(/<link>([^<]+)</)?.[1] || '';
    const pubDate = block.match(/<pubDate[^>]*>([^<]+)<\/pubDate>/)?.[1] || '';
    const desc = block.match(/<description[^>]*>([\s\S]*?)<\/description>/)?.[1] || '';
    const cleanTitle = (title || '').replace(/<!\[CDATA\[|]]>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
    if (cleanTitle && link) {
      items.push({
        title: cleanTitle.slice(0, 200),
        url: link.split('?')[0].trim(),
        publishedAt: pubDate,
        description: (desc || '').replace(/<[^>]+>/g, '').slice(0, 300),
        source: ''
      });
    }
  }
  return items;
}

async function fetchAll() {
  const all = [];
  for (const feed of FEEDS) {
    try {
      const items = await fetchRss(feed.url);
      for (const it of items) {
        all.push({
          ...it,
          source: feed.source,
          ecosystem: 'icp',
          tags: [feed.tag],
          fetchedAt: Date.now()
        });
      }
    } catch (e) {
      console.warn(`Feed ${feed.url} failed:`, e.message);
    }
  }
  const seen = new Set();
  return all
    .filter(n => {
      const k = (n.url || n.title || '').toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.publishedAt || 0).getTime();
      const db = new Date(b.publishedAt || 0).getTime();
      return db - da;
    })
    .slice(0, 50);
}

module.exports = { fetchAll, fetchRss };

if (require.main === module) {
  fetchAll().then(items => {
    console.log(JSON.stringify(items, null, 2));
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
