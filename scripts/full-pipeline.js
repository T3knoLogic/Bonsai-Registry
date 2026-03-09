#!/usr/bin/env node
/**
 * Full Bonsai Registry pipeline: sync → deep-dive → update-export → news
 * Run: npm run pipeline
 * Use with GitHub Actions for scheduled updates.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SCRIPTS = [
  { name: 'sync-export', cmd: 'node', args: ['scripts/sync-export.js'] },
  { name: 'deep-dive', cmd: 'node', args: ['scripts/deep-dive.js'] },
  { name: 'update-export', cmd: 'node', args: ['scripts/update-export.js'] },
  { name: 'news', cmd: 'node', args: ['scripts/news-aggregator.js'] }
];

function run(name, cmd, args) {
  console.log(`\n▶ ${name}...`);
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`\n❌ ${name} failed with exit code ${r.status}`);
    process.exit(r.status);
  }
  console.log(`✓ ${name} done`);
}

function main() {
  console.log('=== Bonsai Registry Full Pipeline ===\n');
  for (const s of SCRIPTS) {
    run(s.name, s.cmd, s.args);
  }
  console.log('\n=== Pipeline complete ===');
}

main();
