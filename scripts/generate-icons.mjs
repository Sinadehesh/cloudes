#!/usr/bin/env node
// Renders every app icon asset, plus the Play Store icon, from one cloud-and-lock symbol.
//
//   npm run icons
//
// Android adaptive icons keep the symbol inside the central safe zone, because launchers crop
// the outer third to a circle, squircle, etc.

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKY_TOP = '#5FA3DC';
const SKY_BOTTOM = '#2F6FA8';
const SUN = '#F5B97A';

const CLOUD =
  'M285 700c-90 0-160-70-160-158 0-83 62-150 143-157 22-116 122-200 240-200 104 0 194 66 228 162 9-1 18-2 27-2 99 0 177 79 177 177S862 700 763 700z';
const lock = (body, keyhole) => `
  <g transform="translate(560 520)">
    <path fill="none" stroke="${body}" stroke-width="34" stroke-linecap="round" d="M58 110V64a62 62 0 0 1 124 0v46"/>
    <rect x="22" y="104" width="196" height="166" rx="34" fill="${body}"/>
    <circle cx="120" cy="172" r="22" fill="${keyhole}"/>
    <rect x="109" y="180" width="22" height="48" rx="11" fill="${keyhole}"/>
  </g>`;

/** A cloud with a small padlock in front of it, 1000×1000 viewBox. */
const symbol = (cloud, body, keyhole) => `<path fill="${cloud}" d="${CLOUD}"/>${lock(body, keyhole)}`;

/** Single-colour version for Android's themed icons: the padlock is cut out of the cloud. */
const monochrome = `
  <mask id="cut"><rect width="1000" height="1000" fill="#fff"/>${lock('#000', '#fff')}</mask>
  <path fill="#FFFFFF" mask="url(#cut)" d="${CLOUD}"/>`;

const svg = (size, content, background = '') =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1000 1000">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY_TOP}"/><stop offset="1" stop-color="${SKY_BOTTOM}"/></linearGradient></defs>
  ${background}${content}</svg>`);

const sky =
  '<rect width="1000" height="1000" fill="url(#sky)"/><circle cx="250" cy="250" r="95" fill="' +
  SUN +
  '" opacity="0.9"/>';
/** Scales the symbol about the centre, so the adaptive layers stay inside the safe zone. */
const scaled = (content, scale) =>
  `<g transform="translate(${500 - 500 * scale} ${500 - 500 * scale}) scale(${scale})">${content}</g>`;

const outputs = [
  ['assets/icon.png', 1024, scaled(symbol('#FFFFFF', '#17293D', '#FFFFFF'), 0.86), sky],
  ['assets/android-icon-foreground.png', 1024, scaled(symbol('#FFFFFF', '#17293D', '#FFFFFF'), 0.62)],
  ['assets/android-icon-background.png', 1024, '', sky],
  ['assets/android-icon-monochrome.png', 1024, scaled(monochrome, 0.62)],
  ['assets/splash-icon.png', 1024, scaled(symbol('#8EC1F0', '#2F6FA8', '#FFFFFF'), 0.95)],
  ['assets/favicon.png', 48, scaled(symbol('#FFFFFF', '#17293D', '#FFFFFF'), 0.9), sky],
  ['store/play-icon-512.png', 512, scaled(symbol('#FFFFFF', '#17293D', '#FFFFFF'), 0.86), sky],
];

mkdirSync(join(root, 'store'), { recursive: true });
for (const [file, size, content, background] of outputs) {
  let image = sharp(svg(size, content, background));
  if (background) image = image.flatten({ background: SKY_BOTTOM });
  await image.png({ compressionLevel: 9 }).toFile(join(root, file));
  console.log(`✓ ${file}`);
}
