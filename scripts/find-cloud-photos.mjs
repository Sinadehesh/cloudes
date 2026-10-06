#!/usr/bin/env node
// Lists candidate photos for a cloud from Openverse (openverse.org, no key needed): openly
// licensed Flickr photos (CC0, Public Domain Mark, CC BY, CC BY-SA; never NC or ND, since the
// app may be sold).
//
//   npm run photos:find -- cumulus                      # 20 candidates, searched by its name
//   npm run photos:find -- cumulus "fair weather cumulus" # with your own search words
//   npm run photos:find -- cumulus --json               # machine-readable, for contact sheets
//
// Open the preview links, pick photos that clearly show the cloud (no heavy filters, little
// ground), and paste their JSON lines into scripts/cloud-photos.json. Then run
// `npm run photos:download`. Openverse limits anonymous use, so search one cloud at a time.

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { CLOUDS_BY_ID } = await import(join(root, 'src/data/clouds.ts'));

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const [cloudId, query] = args;
const cloud = CLOUDS_BY_ID[cloudId];
if (!cloud) {
  console.error(`Usage: npm run photos:find -- <cloud-id> ["search words"]\nUnknown cloud id "${cloudId ?? ''}".`);
  process.exit(1);
}

const q = query ?? cloud.scientificName.replace(/\s*\(.*\)/, '');
const params = new URLSearchParams({
  q,
  source: 'flickr',
  license: 'cc0,pdm,by,by-sa',
  page_size: '20',
  mature: 'false',
});
const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
  headers: { 'User-Agent': 'CloudLock photo curator (https://www.sinadehesh.com/app-lockers/)' },
});
if (!res.ok) throw new Error(`Openverse ${res.status}: ${await res.text()}`);
const { results } = await res.json();

const LICENSES = { cc0: 'CC0', pdm: 'PDM', by: 'CC-BY', 'by-sa': 'CC-BY-SA' };
const candidates = results
  .filter((r) => LICENSES[r.license] && r.url?.includes('staticflickr.com'))
  .map((r) => ({
    url: r.url,
    license: LICENSES[r.license],
    author: r.creator ?? 'Unknown',
    sourceUrl: r.foreign_landing_url,
    title: r.title,
    size: r.width && r.height ? `${r.width}x${r.height}` : '',
  }));

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(candidates, null, 1));
} else {
  console.log(`${cloud.commonName}: “${q}”, ${candidates.length} candidates\n`);
  for (const c of candidates) {
    const { title, size, ...entry } = c;
    console.log(`${title} (${size})\n  ${JSON.stringify(entry)}\n`);
  }
}
