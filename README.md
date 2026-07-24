# Nicholas Olive Oil — website (Cloudflare Pages + Square)

Luxury static site. Cloudflare Pages hosts it; Square handles checkout, inventory, pickup & delivery.

## To make it fully live — 3 things

### 1. Wire the Buy buttons to Square
In `index.html`, near the bottom `<script>`, edit:
```js
const STORE_URL = "https://nicholasoliveoil.square.site";   // your real Square Online store URL
const BUY = { s250:"#", s750:"#", s1l:"#", duo:"#" };        // per-item Square checkout links
```
- Set `STORE_URL` to your Square Online store address. Until per-item links are added, every "Add" button opens the store (still works).
- For a smoother flow, in Square → **Online → Checkout Links / Buy Button**, create a checkout link per item and paste them into `BUY`.

### 2. Email signup (optional but recommended)
The "Get the next drop" form posts to `/api/subscribe` (Cloudflare Pages Function → Resend). In Cloudflare Pages → Settings → Environment variables, set:
- `RESEND_API_KEY`, `TO_EMAIL` (e.g. hello@nicholasoliveoil.com), `FROM_EMAIL` (a verified Resend sender).
If you skip this, the form still fails gracefully and tells people to email you.

### 3. Real photos (big conversion lift)
The hero and product cards currently use elegant SVG bottle art so the site looks complete today. Swap in your Gemini/real photos when ready:
- Hero: replace the `.hero-visual` SVG with an `<img src="assets/hero.jpg">` (the 3-bottle shot).
- Product cards: replace each `.card-img` SVG with an `<img>` of that bottle.
- `assets/og-image.jpg` — a 1200×630 share image.

## Deploy (ShopMora standard: GitHub → Cloudflare Pages)
1. Manny creates the repo in the GitHub UI (Cowork sandbox can't create repos), e.g. `mannyencarnacion-ops/nicholas-olive-oil`.
2. Push these files with **index.html at the repo root** (never zip — extract so root has index.html).
3. Cloudflare Pages → Create project → connect the repo → build settings: framework **None**, build command empty, output dir `/`.
4. Add the custom domain `nicholasoliveoil.com` in Pages, set env vars (above), and it auto-deploys on push.

## Files
- `index.html` — the site (self-contained: inline CSS/JS)
- `functions/api/subscribe.js` — email signup (Resend)
- `_headers`, `_redirects`, `robots.txt`, `sitemap.xml` — hosting config
- `assets/` — drop photos here
