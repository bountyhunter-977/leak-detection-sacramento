// Netlify build script for the Sacramento Leak Detection site.
//
// Two jobs, both run on every deploy:
//  1. Decode the photos. The repo stores images as base64 text files
//     (*.webp.b64) because the photos cannot be pushed as binaries.
//     This writes the real .webp files the pages reference.
//  2. Inject the phone number. phone.json (repo root) is the single
//     source of truth. The HTML files in the repo keep the placeholder
//     number; this replaces it with the phone.json values in every
//     page, so the deployed HTML has the number hardcoded (good for SEO)
//     while the number itself lives in exactly one file.
//
// Edit the number by changing phone.json on GitHub and committing.
// No other file ever needs to change for a number swap.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// --- 1. Decode photos ---
const IMAGES = path.join(ROOT, 'images');
let decoded = 0;
for (const file of fs.readdirSync(IMAGES)) {
  if (!file.endsWith('.webp.b64')) continue;
  const out = path.join(IMAGES, file.replace(/\.b64$/, ''));
  fs.writeFileSync(out, Buffer.from(fs.readFileSync(path.join(IMAGES, file), 'utf8'), 'base64'));
  decoded++;
}
console.log(`Decoded ${decoded} photos.`);

// --- 2. Inject phone number ---
const PLACEHOLDER_DISPLAY = '(916) 555-0142';
const PLACEHOLDER_TEL = '+19165550142';

const phone = JSON.parse(fs.readFileSync(path.join(ROOT, 'phone.json'), 'utf8'));
if (!phone.display || !phone.tel) {
  throw new Error('phone.json must have "display" (e.g. "(916) 555-0142") and "tel" (e.g. "+19165550142").');
}

let filesChanged = 0;
let replacements = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'scripts') continue;
      walk(full);
    } else if (entry.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      const before = html;
      html = html.split(PLACEHOLDER_DISPLAY).join(phone.display);
      html = html.split(PLACEHOLDER_TEL).join(phone.tel);
      if (html !== before) {
        const count = (before.match(/\(916\) 555-0142/g) || []).length
          + (before.match(/\+19165550142/g) || []).length;
        replacements += count;
        filesChanged++;
        fs.writeFileSync(full, html);
      }
    }
  }
}
walk(ROOT);
console.log(`Phone number ${phone.display} injected into ${filesChanged} pages (${replacements} replacements).`);
