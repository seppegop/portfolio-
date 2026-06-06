# Handoff: Giuseppe Orellana — Portfolio Site

## Overview
A personal portfolio website for **Giuseppe Orellana**, a Senior Product Designer based in London. The site presents a hero introduction, a curated list of selected case studies, an about page, four long-form case studies, a styled 404 page, and a mechanical page loader. The aesthetic is **functional brutalism**: a monochrome + sans content system, a visible "ledger" grid, sharp corners, hairline borders instead of shadows, and a single desaturated-olive accent.

The site is fully built and high-fidelity. There are **five top-level views** (Home, Work index, About, Case study template ×4, 404) sharing one design system across two stylesheets.

## About the Design Files
The files in this bundle are **design references created in HTML/CSS/vanilla JS** — a working prototype that shows the intended look, content, and behavior. They are *not* prescribed as the production stack.

The task is to **recreate these designs in the target codebase's environment** using its established patterns and libraries. If no codebase exists yet, choose the most appropriate framework for a content-driven marketing/portfolio site (e.g. **Astro**, **Next.js**, **SvelteKit**, or a static-site generator) and implement the designs there. The HTML provided is clean and semantic enough to port almost directly into components, but treat it as a spec, not as files to ship verbatim.

Because the markup is essentially production-grade static HTML, a perfectly valid path is also to ship it nearly as-is on any static host. Decide based on the team's needs (CMS integration, i18n, etc.).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, interactions, copy, and real imagery are all present. Recreate the UI pixel-perfectly. Every value below is exact — pull tokens directly from the CSS rather than eyeballing.

---

## Design Tokens

Defined as CSS custom properties on `:root` (see `styles.css`). Port these into your theme/token system.

### Colors — light ground (default)
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#FFFFFF` | Page background (pure white) |
| `--paper-2` | `#ECEBE5` | Recessed panels (positioning band, placeholder fill) |
| `--ink` | `#1C1D20` | Body text + headlines (near-black) |
| `--mute` | `#6E6C62` | Metadata / mono chrome text |
| `--faint` | `#97958A` | Least-important mono text |
| `--line` | `#DAD8CF` | Hairline structural rules |
| `--line-2` | `#C4C2B7` | Slightly stronger rules / borders |
| `--line-ink` | `#1C1D20` | Ink-weight rule |
| `--acc` | `#262C23` | **Accent** — deep desaturated olive (links, emphasis) |
| `--acc-2` | `#A6B29A` | Light sage (same hue) for use on dark surfaces |

### Colors — dark ground (re-scoped tokens)
Applied on `.hero` and `.page-head` (home hero, Work/About headers, loader). These surfaces **re-declare** the same token names so descendants adapt automatically:
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#1C1D20` | the dark ground |
| `--paper-2` | `#26272B` | recessed on dark |
| `--ink` | `#F4F3EF` | primary text → near-white |
| `--mute` | `#9D9C95` | metadata on dark |
| `--faint` | `#74736C` | faint on dark |
| `--line` | `rgba(244,243,239,0.14)` | hairline on dark |
| `--line-2` | `rgba(244,243,239,0.30)` | stronger rule on dark |
| `--acc` | `#A6B29A` | light sage accent (legible on dark) |

> **Implementation note:** the dark surfaces work by overriding the CSS variables in their own scope, so all child components (buttons, status marker, eyebrow) invert without per-element rules. Replicate this scoping mechanism — it's central to the system. The loader and 404 page use the same `#1C1D20` / `#F4F3EF` pair.

### Typography
Two Google Fonts, loaded with `display=swap`:
- **Geist** (sans) — weights 400, 500, 600. Used for all *content*: headlines, body, taglines.
- **Geist Mono** (mono) — weights 400, 500. Used for all *interface chrome*: labels, metadata, buttons, nav, eyebrows, captions, footer.

Stacks:
```css
--sans: "Geist", system-ui, -apple-system, "Segoe UI", sans-serif;
--mono: "Geist Mono", ui-monospace, "SF Mono", "Roboto Mono", Menlo, monospace;
```
Body sets `font-feature-settings: "ss01"` and `text-rendering: optimizeLegibility`.

**Type scale** (all clamp() for fluid sizing):
| Class | size | line-height | letter-spacing | weight |
|---|---|---|---|---|
| `.display` | `clamp(2.55rem, 7.4vw, 5.6rem)` | 0.98 | -0.035em | 560 |
| `.h2` | `clamp(1.6rem, 3.6vw, 2.7rem)` | 1.04 | -0.028em | 545 |
| `.h3` | `clamp(1.15rem, 2vw, 1.45rem)` | 1.12 | -0.018em | 545 |
| `.body` | `1.0625rem` | 1.58 | — | 400 (max-width 66ch) |
| `.body-lg` | `clamp(1.15rem, 1.7vw, 1.375rem)` | 1.5 | -0.012em | — (max-width 50ch) |
| `.cs-title` | `clamp(2rem, 4.6vw, 3.5rem)` | 1.02 | -0.03em | 555 |
| `.mono` | `0.72rem` | — | 0.02em | 400 |
| `.label` | `0.7rem` uppercase | — | 0.14em | mono, `--mute` |

Default heading weight is `540`. `text-wrap: balance` on display/h2; `text-wrap: pretty` is appropriate for body copy.

### Spacing
Deliberately uneven (not a uniform 80px rhythm). Driven by clamp tokens:
```css
--pad:    clamp(1.15rem, 4vw, 3.25rem);   /* horizontal page padding */
--gutter: clamp(3.25rem, 11vw, 9.5rem);   /* ledger gutter column width */
```
`--maxw: none` — the layout is **full-bleed** (content fills the viewport width); individual prose blocks keep their own readable measure via `max-width` in `ch`. Section vertical padding is typically `clamp(2rem, 4vw, 3.25rem)`.

### Borders, radius, shadows
- **Border radius: 0 everywhere.** Sharp corners are a defining trait. The only "rounded" thing is the drawn dotted-zero on the 404.
- **No box-shadows anywhere.** Depth is expressed purely with 1px hairline borders (`--line` / `--line-2`).
- The whole frame has continuous side rules: `.frame { border-inline: 1px solid var(--line) }` at ≥720px.

### Motion
```css
--ease: cubic-bezier(0.2, 0, 0, 1);
```
Transitions are short and mechanical (0.12s–0.22s). All animation respects `@media (prefers-reduced-motion: reduce)` (durations forced to ~0). No scroll-reveal animations anywhere — content is present on load.

### Breakpoints
`720px` (frame side rules), `760px` (ledger rows become 2-col, nav status, footer grid), `820px` / `900px` / `940px` / `980px` (component-specific 2-col layouts). Mobile-first: single column collapses by default.

---

## Global Layout & Chrome

### Frame
Everything lives inside `.frame` — a centered container (`max-width: none`, so effectively full-width) with 1px vertical side borders at ≥720px and `min-height: 100vh`.

### Nav (`.nav`)
- Sticky to top, `z-index: 50`, white background, 1px bottom border. Mono, `0.74rem`.
- Left: **brand** ("Design by Giuseppe" on home / "Giuseppe Orellana" elsewhere). Right: nav links **Work / About / Email**.
- Nav links are full-height inline-flex cells separated by 1px left borders (last one also has a right border). **Hover / `aria-current="page"`: invert** (ink background, paper text).
- **Split-flap brand animation** (home only, built in `app.js`): the brand text is split into per-glyph "flap" cells. On hover/focus, each glyph mechanically folds inward (`scaleY(0)`) while the incoming glyph springs out, staggered 20ms per cell — rolling "Design by Giuseppe" up to "Giuseppe Orellana". Built by JS that pads both strings to equal length and generates `.flap > .flap__roll > span×2` per character. Reduced-motion disables the stagger.

### Buttons (`.btn`, `.btn-ghost`)
- Mono, `0.78rem`, uppercase, `letter-spacing: 0.04em`, padding `0.7em 1.05em`, 1px border, **sharp corners**.
- `.btn`: ink fill, paper text → **on hover inverts** to paper fill, ink text. Arrow glyph (`.ar`) translates +3px on hover.
- `.btn-ghost`: transparent fill, ink text, `--line-2` border → on hover fills ink.
- Copy-confirmation state `.btn[data-copied="true"]`: olive accent fill.

### Status marker (`.status .sq`)
A **7×7px solid square** (never a soft dot) in accent color, inline before "Open to work".

### Footer (`.footer`)
- 1px top border. 3-column grid at ≥760px (`1.6fr 1fr 1fr`): brand+blurb / pages links / elsewhere links.
- Column headings `h4`: mono, `0.68rem`, uppercase, `0.14em`, `--faint`.
- Bottom `.footer-meta` bar: 1px top border, mono `0.7rem`, "© 2026 Giuseppe Orellana" left / "All rights and lefts reserved." right.

### Skip link
`.skip-link` — visually hidden until focused, then slides into top-left.

---

## Screens / Views

### 1. Home (`index.html`)
- **Hero** (`.hero--centered`, dark ground, `min-height: calc(100svh - 46px)`): centered stack — eyebrow row (`Senior Product Designer / Based in London / ● Open to work`, mono, separators are `/`, status square accent), `.display` title "Hi! I'm Giuseppe Orellana", `.body-lg` tagline ("I untangle complex systems for users the tech industry usually overlooks."), and two CTAs (`view work` filled, `about` ghost).
- **Selected work** — two **featured entries** (`.entry.feat`): Yanbal (01), Favo (02). Each is a full `<a>` block in a ledger row: left side = mono index + project name; body = role line (mono), `.h2` title with a hover-revealed accent arrow, teaser with `.em` accent spans, and a foot row (`read case study` underline + metrics). At ≥980px the body splits into text (1fr) + image (0.82fr). Image hover: border goes to ink.
- **More work** — two **compact entries** (`.entry-min`): Quantum Talent (03), Real Plaza (04). Row layout `1fr 1.3fr auto` = name / description / tag. **Whole row inverts to ink on hover** (text → paper, tag → sage `--acc-2`).
- **Positioning band** (`.positioning`, `--paper-2` recessed background): a single `.h3` statement about 10+ years of experience.
- **About + Contact** — two ledger `.row`s: about teaser (side label "about") with a "more about me →" link; contact card (side label "contact") with copy-email button + LinkedIn ghost button.

### 2. Work index (`work.html`)
- Dark `.page-head`: breadcrumb (`home / work`), `.display` title "Selected work.", dek, and a `.work-note` meta line (`04 projects · 2018—2026 · disciplines`).
- Four featured entries (`.entry.feat`), one per project, each tagged with its year in the side column (2026 / 2024 / 2021 / 2018). Links to the four case studies.

### 3. About (`about.html`)
- Dark `.page-head`: breadcrumb, `.display` title "Field research, then ship.", dek.
- `.about-wrap` — 2-col at ≥900px (`minmax(18rem,26rem) 1fr`): **left/aside** is a sticky column with a portrait image + a `.facts` definition list (based / study / roots / before / method); **right** is `.about-prose` (lead paragraph larger, then body paragraphs, an "off the clock" `.human` block with top border, CTA buttons, and a trail-running figure). On mobile the portrait leads (`order: -1`).

### 4. Case study template (`cases/*.html`) — Yanbal, Favo, Quantum Talent, Real Plaza
The richest layout. Structure (see `cases/yanbal.html` as the canonical example):
- **Reading progress bar** (`.reading-progress`) — fixed 2px bar at top, fills as you scroll the article (driven in `app.js`).
- **`.cs-head`**: breadcrumb (`home / work / 0N · Name`), `.cs-kicker` (accent mono), `.cs-title`, `.cs-dek`.
- **`.cs-hero-fig`**: full-width 16:10 hero image.
- **`.cs-body` → `.cs-grid`** (2-col at ≥940px: `12rem 1fr`):
  - **`.cs-toc`** — sticky on-this-page nav (mono), each link with a left border that goes ink when `aria-current="true"` (scroll-spy in `app.js`), plus a `.toc-meta` role/timeline block.
  - **`.cs-main` `[data-article]`** — the reading column, a series of `.sec` blocks each with a mono `.sec__label` (§ / 01 / 02…), optional `.sec__h`, and `.prose`:
    - **tl;dr** — bordered `.tldr` block: meta row (role / org / team / timeline) above a summary paragraph with `.em` accent spans.
    - **context / decision / reflection** — prose. Accent emphasis via `.em` / `strong`; ink emphasis via `.num-em`.
    - **what shipped** — `.exhibits`: a vertical stack of `.exhibit` figures, each = mono head (`0N · screen`), a clickable figure image, and an `.exhibit__cap` (h4 + description). Images open a **lightbox gallery** (see Interactions).
    - **outcome** — `.metrics` grid (`repeat(auto-fit, minmax(8.5rem,1fr))`, 1px gaps over a line-colored background → hairline cell dividers): each cell a big number (`.big` with a smaller `.unit` span) + mono label. These are **plain text, not animated counters.**
- **`.cs-next`** — full-width link to the next case study; **inverts to ink on hover**.

### 5. 404 (`404.html`)
- Self-contained (inline `<style>`, no shared CSS). Full dark `#1C1D20` ground, mono font, centered.
- A bordered 4:3 box containing "4 0 4" where the **zero is a drawn dotted-zero**: a hollow oval ring (`border-radius:50%`, ~0.56em × 0.74em) with a centered dot via `::after`. Caption "Got lost?" below.
- A "Return to home" button (paper fill, inverts to outline on hover) below the box.

### Loader (`loader.css` + `loader.js`) — runs on every page load
- Full-screen dark `#1C1D20` curtain, `z-index: 9999`, centered.
- A bordered `200×150px` box with a centered word above a 15px progress strip flush to the bottom edge. The strip fills 0→100% over a fixed run (`RUN = 500ms`), then the **whole curtain slides up** (`translateY(-100%)`, 0.66s `cubic-bezier(0.76,0,0.24,1)`) to reveal the page.
- Per-page word config via data attributes on `[data-loader]`:
  - `data-loader-alt="Hello,Hola"` — home: alternates words on a 250ms interval (hard cut, no transition).
  - `data-loader-word="Work"` / `"About"` / `"YANBAL"` etc. — single static word.
- Locks page scroll (`html` overflow hidden, scroll to top) while the curtain is down; restores after reveal. Reduced-motion: no slide, bar shown full.

---

## Interactions & Behavior

All interaction logic lives in **`app.js`** (site) and **`loader.js`** (loader). No framework, no dependencies.

1. **Split-flap brand** (nav) — described above. Generated in JS from two strings.
2. **Reading progress bar** (case studies) — scales `.reading-progress span` from 0→1 based on `[data-article]` scroll position. Passive scroll/resize listeners.
3. **Scroll-spy TOC** (case studies) — `[data-mininav] a` links get `aria-current="true"` as their section passes 28% of viewport height.
4. **Click-to-copy email** (`[data-copy]` buttons) — copies `data-copy` value via `navigator.clipboard` (with `execCommand` fallback), swaps label to "copied!", sets `data-copied="true"` for the accent state, resets after 1600ms.
5. **Lightbox gallery** (case study exhibits) — clicking any `.exhibit .figimg` opens a full-screen overlay (built dynamically in JS, appended to `<body>`):
   - Dark scrim (`color-mix(in oklab, var(--ink) 90%, transparent)`), centered contained image (max 82vw / 72vh), mono caption with `NN / NN` count + label, close button, prev/next nav, and a thumbnail rail.
   - Each visible exhibit becomes the first entry of its set; **extra detail screens** are declared on the image via `data-gallery-extra="src::alt||src::alt"` and appear *only* in the lightbox (not on the page).
   - Keyboard: `Esc` closes, `←` / `→` navigate. Focus moves to close button on open, returns to trigger on close. Body scroll locked while open. Single-image galleries hide nav + thumbs.
6. **Hover states** — nav cells invert; `.entry-min` rows invert wholesale; `.cs-next` inverts; buttons invert; entry arrows + read-underlines shift; image borders go ink. All `0.12s var(--ease)`.

### State
The site is **stateless** — no persisted state, no data fetching, no forms (the "form" is a mailto link + copy-to-clipboard). The only transient UI states are: copy-confirmation (1.6s timeout), lightbox open/current-index, scroll-derived progress + active-section. In a component framework these map to simple local component state.

### Responsive behavior
Mobile-first single column. Key reflows at the breakpoints listed above: ledger rows go 1→2 columns at 760px; featured entry body splits text/image at 980px; about goes 2-col at 900px (portrait leads on mobile via `order:-1`); case-study TOC appears at 940px. Lightbox image caps shrink at 640px.

---

## Assets

All imagery is real (no placeholders remain). Located in `assets/` — **all referenced files are copied into this handoff under `assets/`**.

- `favicon.png` — site favicon.
- **Hero / montage images** (16:10): `yanbal-hero.jpg`, `favo-hero.jpg`, `quantum-hero.jpg`, `realplaza-pequeplanes.jpg`, `about-trail.jpg`, `giuseppe-portrait.jpg`.
- **Case-study exhibit figures + detail screens** (shown on page and/or in the lightbox), per project, e.g.:
  - Yanbal: `yanbal-fig01-home*.jpg`, `yanbal-fig02-rewards*.jpg`, `yanbal-fig03-bag*.jpg` (each with `-detail-1` / `-detail-2` gallery extras).
  - Favo: `favo-fig01-home*.jpg`, `favo-fig02-savings*.jpg`.
  - Quantum Talent: `quantum-fig01-*.jpg`, `quantum-fig02-*.jpg`.
  - Real Plaza: `realplaza-fig01-platform.jpg`, `realplaza-fig02-space*.jpg`, `realplaza-fig03-relaunch.jpg`.

The `-detail-*` variants are referenced only via `data-gallery-extra` on their parent exhibit image and appear only inside the lightbox. (The project's `uploads/` source files and `screenshots/` QA captures are **not** included — they aren't part of the shipped design.)

**Fonts:** Geist + Geist Mono are loaded from Google Fonts via `<link>`. In a real build, consider self-hosting them (e.g. `@fontsource/geist-sans` / `@fontsource/geist-mono`) for performance and offline support.

---

## Files in this bundle
The full working design is included so you can run it locally and inspect exact behavior:

```
design_handoff_portfolio/
├── README.md            ← this file
├── index.html           ← Home
├── work.html            ← Work index
├── about.html           ← About
├── 404.html             ← styled 404 (self-contained)
├── styles.css           ← core design system + Home styles
├── pages.css            ← About / Work / Case-study styles (loaded after styles.css)
├── loader.css           ← page loader styles
├── app.js               ← site interactions (split-flap, progress, scroll-spy, copy, lightbox)
├── loader.js            ← loader timing + word logic
├── cases/
│   ├── yanbal.html       ← canonical case-study template
│   ├── favo.html
│   ├── quantum-talent.html
│   └── real-plaza.html
└── assets/               ← all referenced images + favicon
```

**Load order matters:** every page loads `styles.css` first, then `pages.css` (on non-home pages), then `loader.css`. `loader.js` and `app.js` load at the end of `<body>`.

To preview: open any `.html` in a browser, or serve the folder with any static server (`npx serve`). Navigate from the home page.

## Recreation notes
- Componentize the repeated chrome first: **Nav**, **Footer**, **Loader**, **Button**, **LedgerRow/Entry**, **Exhibit + Lightbox**, **Metrics grid**, **TOC**. Case studies share one template differing only in content — model them as data (frontmatter / CMS / JSON) feeding one template.
- Preserve the **CSS-variable re-scoping** trick for dark surfaces rather than writing duplicate dark-mode rules.
- Keep **sharp corners, no shadows, hairline borders, and the mono/sans split** as hard rules — they define the brand. Don't introduce rounded corners, drop shadows, or a third typeface.
- Respect `prefers-reduced-motion` throughout (already wired in the CSS/JS).
- The lightbox `data-gallery-extra` convention is a lightweight authoring API; in a component framework, model exhibit extras as an array of `{src, alt}` on each exhibit instead.
