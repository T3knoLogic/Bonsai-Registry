#!/usr/bin/env node
/**
 * Scrape DFINITY Developer Grants page for grantee info
 * Source: https://dfinity.org/grants
 * Note: Page loads content dynamically; we extract what we can from initial HTML
 */

async function fetchGrants() {
  const url = 'https://dfinity.org/grants';
  const res = await fetch(url, { headers: { 'User-Agent': 'BonsaiRegistry/1.0' } });
  const html = await res.text();
  const projects = [];
  const nameRe = /"name"\s*:\s*"([^"]+)"/g;
  const descRe = /"description"\s*:\s*"([^"]+)"/g;
  const linkRe = /(https?:\/\/[^\s"<>]+)/g;
  let m;
  const names = [];
  while ((m = nameRe.exec(html)) !== null) {
    const n = m[1];
    if (n.length > 3 && n.length < 80 && !names.includes(n)) names.push(n);
  }
  const links = [];
  while ((m = html.match(/href="(https:\/\/[^"]+)"/g)) !== null) {
    for (const h of [...html.matchAll(/href="(https:\/\/[^"]+)"/g)]) {
      const u = h[1];
      if (u.includes('github.com') || u.includes('dfinity') || u.includes('.app') || u.includes('.io') || u.includes('.xyz')) {
        if (!links.includes(u)) links.push(u);
      }
    }
    break;
  }
  const projectNames = new Set([
    'ICPSwap', 'ICTO', 'DAOball', 'SecureGuard Escrow', 'Knowledge Token', 'Demergent Labs', 'Codebase',
    'Trust Wallet', 'ckSOL', 'MSQ', 'KonectA_Dao', 'NatLabs', 'IC4J', 'BloqSens', 'Azle', 'Kybra'
  ]);
  for (const name of names) {
    if (projectNames.has(name) || /^(ICPSwap|Azle|Kybra|DAOball|ICTO)/i.test(name)) {
      projects.push({
        name,
        description: `DFINITY Developer Grant recipient: ${name}`,
        url: '',
        ecosystem: 'icp',
        categories: ['tools'],
        grantRecipient: true,
        source: 'dfinity-grants',
        createdAt: Date.now()
      });
    }
  }
  return projects;
}

module.exports = { fetchGrants };

if (require.main === module) {
  fetchGrants().then(p => {
    console.log(JSON.stringify(p, null, 2));
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
