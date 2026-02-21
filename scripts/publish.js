#!/usr/bin/env node
// publish.js — Publish only packages not yet on npm
// Usage:
//   node scripts/publish.js --otp=123456        (with 2FA code)
//   NPM_TOKEN=<automation-token> node scripts/publish.js

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse --otp=XXXXXX from args
const otpArg = process.argv.find((a) => a.startsWith('--otp='));
const OTP = otpArg ? otpArg.split('=')[1] : '';

const ROOT = path.resolve(__dirname, '..');
const PACKAGES = [
  'meta',
  'preview',
  'react',
  'readability',
  'redirects',
  'schema',
  'search-console',
  'sitemap',
  'tracking',
];

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: 'pipe', ...opts }).trim();
}

function runLoud(cmd, cwd) {
  execSync(cmd, { stdio: 'inherit', cwd });
}

// Verify auth
try {
  const user = run('npm whoami --registry https://registry.npmjs.org');
  console.log(`\nLogged in as: ${user}\n`);
} catch {
  console.error('ERROR: Not logged in to npm. Run "npm login" first.\n');
  process.exit(1);
}

const published = [];
const skipped = [];
const failed = [];

for (const pkg of PACKAGES) {
  const dir = path.join(ROOT, 'packages', pkg);
  const pkgJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  const { name, version } = pkgJson;

  // Check if this version already exists on npm
  let existing = '';
  try {
    existing = run(`npm view ${name}@${version} version --registry https://registry.npmjs.org`);
  } catch {
    /* not found = not published yet */
  }

  if (existing) {
    console.log(`SKIP  ${name}@${version} (already on npm)`);
    skipped.push(`${name}@${version}`);
    continue;
  }

  console.log(`\nPublishing ${name}@${version}...`);
  try {
    const otpFlag = OTP ? ` --otp=${OTP}` : '';
    runLoud(`npm publish --access public${otpFlag}`, dir);
    console.log(`OK    ${name}@${version}`);
    published.push(`${name}@${version}`);
  } catch (err) {
    console.error(`FAIL  ${name}@${version}`);
    failed.push(`${name}@${version}`);
  }
}

console.log('\n==============================');
console.log(`Published : ${published.length} packages`);
published.forEach((p) => console.log(`  ✓ ${p}`));
console.log(`Skipped   : ${skipped.length} packages (already on npm)`);
console.log(`Failed    : ${failed.length} packages`);
failed.forEach((p) => console.log(`  ✗ ${p}`));
console.log('==============================\n');

process.exit(failed.length > 0 ? 1 : 0);
