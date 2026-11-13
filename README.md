# Sacramento Leak Detection — lead-gen site

Static pay-per-call lead-generation site for leak detection in Sacramento, CA.
Brand: **Sacramento Leak Detection**. Live at `leakdetectionsacramento.netlify.app`.

## How to change the phone number (the only thing that ever changes)

1. Open `phone.json` on GitHub and click the pencil (Edit).
2. Change `display` (what visitors see, e.g. `"(916) 555-0142"`) and `tel`
   (the link target, e.g. `"+19165550142"` — digits with a leading `+1`).
3. Commit. Netlify rebuilds automatically and the new number appears on
   every page within a minute or two.

No other file needs editing for a number swap. The HTML files in this repo
keep a placeholder number; `scripts/build.js` swaps in the `phone.json`
values during every Netlify build, so the deployed HTML still has the number
hardcoded (good for SEO).

## Photos

The photos live in `images/` as base64 text files (`*.webp.b64`) because
they cannot be pushed as binaries. `scripts/build.js` decodes them to real
`.webp` files during the build. Do not delete the `.b64` files.

## Deploy

Connected to Netlify (Git-based deploys). Every push to `main` triggers a
new deploy of the same site and URL. The build command and publish directory
come from `netlify.toml`, so nothing needs typing in the Netlify dashboard.

## Structure

- 32 HTML pages (folder-per-page), `styles.css`, `sitemap.xml`, `robots.txt`, `_headers`
- Hub + 11 service pages + cost-factors page + 6 suburb pages + 3 guides + contact / about / privacy / terms / 404 / thank-you
- Netlify form on `/contact/` (name `leak-help`)
