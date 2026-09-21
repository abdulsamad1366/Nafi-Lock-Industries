# Placeholder Assets

Until real product photography is available, the site uses simple SVG
line-art icons as placeholders, styled to match each brand's palette.

## Files
- `padlock.svg` — Nafi/S-Nafi brass palette
- `mortise-lock.svg` — Nafi/S-Nafi brass palette
- `cylindrical-lock.svg` — Nafi/S-Nafi brass palette
- `cabinet-lock.svg` — Nafi/S-Nafi brass palette
- `hasp-staple.svg` — Nafi/S-Nafi brass palette
- `greek-padlock.svg` — Greek palette (Aegean blue/marble) example
- `raksham-padlock.svg` — Raksham palette (guard red/gunmetal) example

## Usage
Place these in `frontend/public/placeholders/`. Reference them as the default
`images[0]` for any product that doesn't yet have a real photo uploaded via
the admin panel.

## Replacing with real photos
Once real product photography exists:
1. Upload via `/admin/products` (handled by Multer + Sharp on the backend —
   images are resized/compressed automatically on upload).
2. Real images are stored in `backend/uploads/` and referenced by URL in the
   `Product.images` field — no code change needed, since products already
   pull their image list from the database.
3. Placeholder SVGs can remain in the repo as a fallback for any product
   without an uploaded photo yet.

## Extending to a 4th category or brand later
Follow the same visual pattern: brass/steel line art on a `#1E1B16` (or the
relevant brand's surface color) background, labeled in `IBM Plex Mono` at the
bottom, so new placeholders stay visually consistent with the existing set.
