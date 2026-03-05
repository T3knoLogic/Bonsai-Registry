#!/usr/bin/env node
/**
 * Fetch DFINITY / Internet Computer blog posts and news
 * Sources: internetcomputer.org/blog, medium.com/dfinity
 */

async function fetchBlogArchive() {
  const url = 'https://internetcomputer.org/blog/archive';
  const res = await fetch(url);
  const html = await res.text();
  const news = [];
  const linkRe = /<a[^>]+href="(\/blog\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    const [, href, title] = m;
    if (href && title && title.length > 10 && !title.includes('Previous') && !title.includes('Next')) {
      news.push({
        title: title.trim(),
        url: `https://internetcomputer.org${href}`,
        source: 'internetcomputer.org',
        ecosystem: 'icp',
        tags: ['blog', 'news'],
        createdAt: Date.now()
      });
    }
  }
  const seen = new Set();
  return news.filter(n => {
    const k = n.url;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 50);
}

async function fetchMediumDfinity() {
  const url = 'https://medium.com/dfinity';
  const res = await fetch(url);
  const html = await res.text();
  const news = [];
  const linkRe = /<a[^>]+href="(https:\/\/medium\.com\/dfinity\/[^"]+)"[^>]*>([^<]{20,120})<\/a>/g;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    const [, href, title] = m;
    if (href && title && !title.includes('Follow') && !title.includes('Sign in')) {
      news.push({
        title: title.replace(/<[^>]+>/g, '').trim().slice(0, 150),
        url: href.split('?')[0],
        source: 'medium.com/dfinity',
        ecosystem: 'icp',
        tags: ['blog', 'news'],
        createdAt: Date.now()
      });
    }
  }
  const seen = new Set();
  return news.filter(n => {
    const k = n.url;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 30);
}

const CURATED_NEWS = [
  { title: 'Internet Computer Unleashes New Era of Speed, Developer Ease, and Onchain Storage', url: 'https://medium.com/dfinity/internet-computer-unleashes-new-era-of-speed-developer-ease-and-onchain-storage-with-major-d0ebcfa5b0e4', source: 'medium.com/dfinity', ecosystem: 'icp', tags: ['upgrades', 'tokamak', 'beryllium'] },
  { title: 'ICP HUB USA Launches, Supporting Global Expansion', url: 'https://www.prweb.com/releases/icp-hub-usa-launches-supporting-global-expansion-of-the-internet-computer-protocol-icp-302383060.html', source: 'prweb', ecosystem: 'icp', tags: ['hub', 'usa'] },
  { title: 'Validation Cloud and DFINITY Partner for Enterprise Blockchain Analytics', url: 'https://blog.validationcloud.io/dfinity-icp-elliptic', source: 'validationcloud', ecosystem: 'icp', tags: ['partnership', 'enterprise'] },
  { title: 'DFINITY Launches $5M DeAI Grant for Decentralized AI on ICP', url: 'https://www.prnewswire.com/news-releases/dfinity-foundation-launches-5-million-grant-to-support-decentralized-ai-on-the-internet-computer-blockchain-301877065.html', source: 'prnewswire', ecosystem: 'icp', tags: ['grant', 'ai'] },
  { title: 'BTC Flower: Generative NFTs on ICP Bloom Into DAO', url: 'https://medium.com/dfinity/btc-flower-generative-nfts-on-the-internet-computer-bloom-into-dao-559ffc78cb69', source: 'medium.com/dfinity', ecosystem: 'icp', tags: ['nft', 'dao'] },
  { title: 'Developer weekly update | Internet Computer', url: 'https://internetcomputer.org/blog', source: 'internetcomputer.org', ecosystem: 'icp', tags: ['developer', 'updates'] }
].map(n => ({ ...n, createdAt: Date.now() }));

async function fetchAll() {
  const [archive, medium] = await Promise.all([
    fetchBlogArchive().catch(() => []),
    fetchMediumDfinity().catch(() => [])
  ]);
  const scraped = [...archive, ...medium];
  return scraped.length > 0 ? scraped : CURATED_NEWS;
}

module.exports = { fetchBlogArchive, fetchMediumDfinity, fetchAll };

if (require.main === module) {
  fetchAll().then(n => {
    console.log(JSON.stringify(n, null, 2));
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
