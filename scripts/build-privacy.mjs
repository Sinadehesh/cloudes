// Writes the privacy policy's public web page and PRIVACY.md from src/data/privacyPolicy.ts.
// The site (root site/) serves it at /privacy/, and at /cloudlock/privacy/ for
// https://www.sinadehesh.com/cloudlock/privacy/. Node 22.18+ runs the .ts import.
import { mkdirSync, writeFileSync } from 'node:fs';

import { privacyHtml, privacyMarkdown } from '../src/data/privacyPolicy.ts';

const site = (path) => new URL(`../site/${path}`, import.meta.url);
for (const dir of ['privacy/', 'cloudlock/privacy/']) {
  mkdirSync(site(dir), { recursive: true });
  writeFileSync(site(`${dir}index.html`), privacyHtml());
}
writeFileSync(new URL('../PRIVACY.md', import.meta.url), privacyMarkdown());
console.log('Wrote site/privacy/, site/cloudlock/privacy/ and PRIVACY.md');
