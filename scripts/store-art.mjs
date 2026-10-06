#!/usr/bin/env node
// Renders the Play Store art that isn't a screenshot:
//   (the 512×512 store icon comes from `npm run icons`)
//   store/play-feature-graphic.png 1024×500: logo, name and tagline, and a lock-screen quiz card.
// The card's photo must be CC0, so the art needs no credit: shelf cloud #1 (see scripts/cloud-photos.json).
//
//   npm run store-art

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CREAM = '#F4F8FC';
const INK = '#17293D';
const SUN = '#FFD9A8';
const GREEN = '#2E7D5B';

async function featureGraphic() {
  const W = 1024;
  const H = 500;
  const card = { x: 612, y: 38, w: 346, h: 424 };
  const photo = { x: card.x + 18, y: card.y + 52, w: card.w - 36, h: 200 };
  const chipW = 147;
  const chip = (x, y, label, right) => `
    <rect x="${x}" y="${y}" width="${chipW}" height="42" rx="12" fill="#FFFFFF" stroke="${right ? GREEN : '#D3DEEA'}" stroke-width="${right ? 3 : 1.5}" />
    <text x="${x + chipW / 2}" y="${y + 27}" text-anchor="middle" font-family="Helvetica, Arial, 'Liberation Sans', sans-serif" font-size="16" font-weight="bold" fill="${right ? GREEN : INK}">${label}</text>`;
  const cx = card.x + 18;
  const cy = photo.y + photo.h + 50;
  const scene = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#6FB1E6" />
        <stop offset="0.55" stop-color="#2F6FA8" />
        <stop offset="1" stop-color="#1B4A78" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity="0.35" />
      </filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)" />
    <text x="66" y="262" font-family="Georgia, 'DejaVu Serif', serif" font-weight="bold" font-size="74" fill="#FFFFFF">CloudLock</text>
    <text x="68" y="318" font-family="Helvetica, Arial, 'Liberation Sans', sans-serif" font-size="30" fill="#FFFFFF">Name the cloud. Unlock your app.</text>
    <text x="68" y="362" font-family="Helvetica, Arial, 'Liberation Sans', sans-serif" font-size="21" fill="${SUN}">Read the sky: 36 clouds and what they mean</text>
    <rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="28" fill="${CREAM}" filter="url(#shadow)" />
    <text x="${cx}" y="${card.y + 34}" font-family="Helvetica, Arial, 'Liberation Sans', sans-serif" font-size="13" font-weight="bold" letter-spacing="1.5" fill="#5B6B7D">YOUR APP IS LOCKED</text>
    <text x="${cx}" y="${cy - 14}" font-family="Georgia, 'DejaVu Serif', serif" font-size="23" font-weight="bold" fill="${INK}">What is this cloud?</text>
    ${chip(cx, cy, 'Roll Cloud', false)}${chip(cx + chipW + 16, cy, 'Shelf Cloud ✓', true)}
    ${chip(cx, cy + 52, 'Wall Cloud', false)}${chip(cx + chipW + 16, cy + 52, 'Cumulonimbus', false)}
  </svg>`);
  const roundMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${photo.w}" height="${photo.h}"><rect width="${photo.w}" height="${photo.h}" rx="18" /></svg>`,
  );
  const cloud = await sharp(join(root, 'assets/clouds/arcus-1.jpg'))
    .resize(photo.w, photo.h, { fit: 'cover', position: 'attention' })
    .composite([{ input: roundMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const logo = await sharp(join(root, 'assets/android-icon-foreground.png')).resize(190, 190).png().toBuffer();
  return sharp({ create: { width: W, height: H, channels: 3, background: CREAM } }).composite([
    { input: scene, left: 0, top: 0 },
    { input: cloud, left: photo.x, top: photo.y },
    { input: logo, left: 34, top: 20 },
  ]);
}

mkdirSync(join(root, 'store'), { recursive: true });
await (await featureGraphic())
  .removeAlpha()
  .png({ compressionLevel: 9 })
  .toFile(join(root, 'store/play-feature-graphic.png'));
console.log('✓ store/play-feature-graphic.png');
