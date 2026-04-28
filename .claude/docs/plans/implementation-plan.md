# Implementation plan — Anabela Teslić Portfolio

## Context

A multi-page static portfolio site for designer Anabela Teslić, deployed on
GitHub Pages. Stack is intentionally tiny: vanilla HTML5, vanilla CSS with
custom properties (no preprocessors), and a single small `js/main.js` only
where strictly required. The design comes from
<https://www.figma.com/design/nb4xDttczmwlSC7if3zJ9R/Portfolio>.

Tokens and components are sourced from the **Sticker Sheet** page
(canvas `813:387`); page geometry, paddings, and per-breakpoint type sizes
are sourced from the **Design** page (canvas `0:1`) via Figma MCP
`get_design_context`, which returns precise style code for every desktop
and mobile frame. Desktop frames target 1920 px; mobile frames target
390 px.

This plan describes the actual implementation. Once approved, the
implementation agent will produce the file tree below; until then, no code
files are created.

---

## 1. File tree to produce

```
/
├── index.html                       Homepage
├── pages/
│   ├── ux-ui-design.html
│   ├── graphic-design.html
│   ├── fine-arts.html
│   └── about-me.html
├── css/
│   ├── base.css                     reset, :root tokens, typography defaults
│   ├── layout.css                   page shell, sidebar, topbar, project layout, masonry
│   ├── components.css               nav, button, project card, education/experience, skills, social
│   ├── animations.css               keyframes, transitions, prefers-reduced-motion
│   └── about-me.css                 page-specific (hero "designer" word, headline band)
├── assets/
│   ├── images/                      see §7 manifest
│   └── icons/
├── js/
│   └── main.js                      mobile menu toggle + scroll reveal
└── .nojekyll                        keep underscored paths working on Pages
```

CSS load order (every page): `base.css` → `layout.css` → `components.css`
→ `animations.css` → optional page-specific. All hrefs are relative
(no leading `/`).

---

## 2. Pages and Figma frame mapping

| Route | File | Desktop frame | Mobile frame |
|---|---|---|---|
| `/` | `index.html` | `427:732` (1920×1000) | `766:369` (390×844) |
| `/pages/ux-ui-design.html` | UX/UI Design | `573:402` (1920×4664) | `766:370` (390×2883) |
| `/pages/graphic-design.html` | Graphic Design | `540:363` (1920×14278) | `767:371` (390×7739) |
| `/pages/fine-arts.html` | Fine Arts | `427:910` (1920×4590) | `767:372` (390×844 — partial) |
| `/pages/about-me.html` | About Me | `427:921` (1920×5025) | `767:373` (390×3852) |

Project list (display order):

- **UX/UI Design**: Artura · Snagie · E-Sharp
- **Graphic Design**: Salvador Dalí Exhibition · CatWalk · Tinel · Naturellement · Archeological Museum Zadar · Time · Toto Travel
- **Fine Arts**: continuous masonry gallery (5 tiles in Figma desktop frame; mobile is unfinished — fill with single-column tiles)
- **About Me**: Headline → Experience → Skills → Education

---

## 3. Design tokens (from Sticker Sheet `813:387`)

All in `:root {}` of `css/base.css`. Names mirror the Sticker Sheet's
"Color styles" / "Text styles" labels.

### 3.1 Colors

| Custom property | Hex | Sticker-sheet label | Use |
|---|---|---|---|
| `--color-surface` | `#ECECEC` | surface | Page background |
| `--color-surface-variant` | `#DAD6D5` | surface variant | About Me Headline + Skills section |
| `--color-on-surface` | `#3A3733` | on surface (a.k.a. surface dark) | Body text default |
| `--color-on-surface-variant` | `#2E2A24` | on surface variant | Text on cards |
| `--color-on-surface-muted` | `#7A7A7A` | (Portfolio/OnSurface/Medium in page contexts) | Muted UPPERCASE subtitles |
| `--color-primary` | `#C4502A` | primary | Button, accent text, hover state, hero word "designer" |
| `--color-primary-container` | `#ECECEC` | primary container | Tag / badge surface |
| `--color-on-primary` | `#FFFFFF` | (Hovered button text) | Text on primary fills |

Project-band background colors (each used once as a colored panel behind
a project hero):

| Custom property | Hex | Project |
|---|---|---|
| `--color-band-artura` | `#9C2541` | Artura |
| `--color-band-amz` | `#D5BA6D` | Archeological Museum Zadar |
| `--color-band-naturellement` | `#17181A` | Naturellement |
| `--color-band-catwalk` | `#C2BBE7` | CatWalk |

### 3.2 Typography

Two families via Google Fonts: **Unbounded** (400, 500, 600) for display
headings and the wordmark; **Manrope** (400, 500, 700) for everything
else. The Sticker Sheet defines twelve text styles. Letter-spacing in
Figma is 1/1000 em; the px values below assume the listed font size.

| Custom property | Family · weight · size | Line-height | Letter-spacing | Case | Sticker-sheet name |
|---|---|---|---|---|---|
| `--text-headline-large` | Unbounded · 400 · 48 px | 100 % | 0 | Sentence | H1 / Headline Large |
| `--text-headline-medium` | Unbounded · 400 · 36 px | 100 % | 0 | Sentence | H2 / Headline Medium |
| `--text-headline-small` | Unbounded · 500 · 24 px | 100 % | 0 | Sentence | H3 / Headline Small |
| `--text-title-large` | Manrope · 500 · 18 px | 100 % | 0.06 em (1.08 px) | UPPERCASE | T1 / Title Large |
| `--text-title-medium` | Manrope · 500 · 16 px | 100 % | 0.08 em (1.28 px) | UPPERCASE | T2 / Title Medium |
| `--text-title-small` | Manrope · 500 · 14 px | 100 % | 0.08 em (1.12 px) | UPPERCASE | T3 / Title Small |
| `--text-body-large` | Manrope · 400 · 17 px | 30 px | 0.06 em (1.02 px) | Sentence | B1 / Body Large |
| `--text-body-medium` | Manrope · 400 · 14 px | 18 px | 0.08 em (1.12 px) | Sentence | B2 / Body Medium |
| `--text-body-small` | Manrope · 400 · 12 px | 16 px | 0.08 em (0.96 px) | Sentence | B3 / Body Small |
| `--text-label-large` | Manrope · 700 · 15 px | 30 px | 0.20 em (3 px) | UPPERCASE | L1 / Label Large |
| `--text-label-medium` | Manrope · 700 · 14 px | 18 px | 0.12 em (1.68 px) | UPPERCASE | L2 / Label Medium |
| `--text-label-small` | Manrope · 700 · 12 px | 18 px | 0.12 em (1.44 px) | UPPERCASE | L3 / Label Small |

Three additional sizes appear in the Design canvas but are **not** on the
Sticker Sheet — they're page-specific overrides:

- `--text-logo-desktop`: Unbounded SemiBold **20 px**, two-line "ANABELA / TESLIĆ" (sidebar, desktop)
- `--text-logo-mobile`: Unbounded SemiBold **14 px**, single-line "ANABELA TESLIĆ" (topbar, mobile)
- `--text-hero-display`: Unbounded Regular **72 px** / line-height 100 px, color `--color-primary` (used once: About Me hero word "designer", desktop only)
- `--text-headline-xsmall`: Unbounded Medium **16 px** (mobile-only sub-heading inside Job position / Education / Skill group cards — not a Sticker Sheet token, but applied consistently across the mobile About Me frame)
- `--text-meta-email`: Manrope Regular **13 px** / line-height 16 px / 0.08 em (sidebar email link; close to but distinct from Body Medium 14 px)

### 3.3 Spacing scale (4 px base)

```
--space-1: 4px;    --space-2: 8px;    --space-3: 12px;
--space-4: 16px;   --space-5: 20px;   --space-6: 24px;
--space-7: 28px;   --space-8: 32px;   --space-9: 36px;
--space-10: 40px;  --space-12: 48px;  --space-15: 60px;
--space-16: 64px;  --space-20: 80px;  --space-25: 100px;
--space-30: 120px; --space-40: 160px; --space-50: 200px;
--space-60: 240px; --space-65: 260px; --space-75: 300px;
```

Notable values pulled from frames: mobile horizontal gutter `36 px`,
mobile vertical section gap `64 px`, desktop project section padding
`260 px top / 200 px bottom`, desktop sidebar gutter `78 px` after the
290 px sidebar.

### 3.4 Layout constants

```
--sidebar-width: 290px;
--sidebar-padding-x: 40px;
--page-gutter-left: 78px;     /* 368 - 290 (desktop project content offset) */
--mobile-gutter: 36px;
--topbar-height: 82px;
--topbar-padding-top: 30px;
--button-height-lg: 71px;
--button-height-sm: 42px;
--button-width-lg: 411px;
--button-width-sm: 320px;
--avatar-size-desktop: 80px;
--avatar-size-mobile: 36px;
--radius-pill: 9999px;
--bp-mobile: 900px;
--focus-ring: 2px solid var(--color-primary);

--transition-fast: 150ms ease-out;
--transition-base: 250ms ease-out;
--transition-slow: 400ms ease-out;
```

No drop shadows in the design; the file is intentionally flat.

---

## 4. Per-breakpoint typography mapping

The mobile frames are not just smaller versions of the desktop — they
re-pick text styles from the scale. This table is what the implementation
agent uses to wire `clamp()`-based responsive overrides.

| Element | Desktop spec | Mobile spec |
|---|---|---|
| Project title (UX/UI, Graphic) | Headline Large 48 px | Headline Small 24 px (centered) |
| Project subtitle | Title Large 18 px (UPPERCASE muted) | Title Small 14 px (UPPERCASE muted, centered) |
| Project description | Body Large 17 px (lh 30) | Body Small 12 px (lh 16, centered) |
| "Case Study" button | Large variant 411×71, Label Large | Small variant 320×42, Label Small |
| Section title (Experience / Skills / Education) | Headline Large 48 px | Headline Small 24 px |
| Job position / Education item title | Headline Small 24 px | `--text-headline-xsmall` 16 px Unbounded Medium |
| Job / Education company + duration | Title Large 18 px (muted) | Title Small 14 px (muted) |
| Job / Education description | Body Large 17 px | Body Small 12 px |
| Skill group subtitle | Title Large 18 px (muted) | Title Small 14 px **`--color-primary`** (deliberate mobile recolor) |
| Skill group item title | Headline Small 24 px | `--text-headline-xsmall` 16 px |
| Skill group item body | Body Large 17 px | Body Small 12 px |
| About Me hero "I'm a / designer / with five years" | 24 / 72 / 24 px (Unbounded) | All 24 px centered (Unbounded Medium) |
| Logo wordmark | 20 px Unbounded SemiBold, two lines | 14 px Unbounded SemiBold, one line |
| Sidebar nav (desktop) | Label Large 15 px / 0.20 em | n/a (replaced by topbar + dropdown) |
| Mobile dropdown menu items | n/a | Label Large 15 px (matches desktop sidebar) |
| Sidebar email | Manrope Regular 13 px / 0.08 em | n/a |

---

## 5. Reusable components (from Sticker Sheet)

The Sticker Sheet defines four component sets; pages compose them with
project content. Each is implemented as a plain class in
`css/components.css`. Behavioural states use `:hover`, `:focus-visible`,
`:active`, and `[aria-current]` — not separate classes.

### 5.1 Button — `Style=Button` (`6:192`)

Five canonical variants on the Sticker Sheet: Enabled / Hovered / Pressed
× Large / Small.

| State | Size | Spec |
|---|---|---|
| Enabled | Large | 411 × 71, 1 px solid `--color-primary` border, transparent fill, text `--color-primary` Label Large |
| Hovered | Large | 411 × 71, fill `--color-primary`, text `--color-on-primary` (#FFF) Label Large, same border |
| Enabled | Small | 320 × 42, border-only treatment, text `--color-primary` Label Small (12 px / 0.12 em) |
| Pressed | Small | 320 × 42, fill `--color-primary`, text `--color-on-primary` Label Small |

Mobile UX/UI project frames use the Small Enabled variant (320 × 42) for
the Case Study CTA. Desktop UX/UI frames use the Large Enabled variant
(411 × 71). CSS class `.btn-case-study` with a `--size: lg | sm`
modifier; `:hover`/`:focus-visible` reproduce the Hovered visual.

### 5.2 Menu button — `Menu button` (`75:255`)

Three states × two sizes; used inside the desktop sidebar and the mobile
dropdown.

| State | Visual |
|---|---|
| Enabled | Color `--color-on-surface`, 210 × 40 (Large) / 210 × 34 (Small), text Label Large / Label Medium |
| Hovered | Color `--color-primary`, **+10 px horizontal padding** on the inner label container (small indent on hover) |
| Pressed | Right-aligned (`align-items: flex-end`), color `--color-on-surface`. On the sidebar this is the **active page indicator** |

CSS: `.menu-button[aria-current="page"]` reproduces the Pressed look.

### 5.3 Dropdown menu — `Dropdown menu` (`75:969`)

Three states. The Pressed state for UX/UI Design exposes child items
(Artura / Snagie / E-Sharp) in Label Medium (210 × 34), all right-aligned
under the parent. This is the layout used in the Sticker Sheet's
"State=UX/UI" sidebar variant.

CSS pattern: `.menu-dropdown` with a child `<ul class="menu-dropdown__items">`
hidden by default and shown when the parent has `[aria-current="page"]`.
No JS needed for the desktop sidebar's expansion.

### 5.4 Navigation sidebar — `Navigation sidebar` (`75:252`)

Five state variants on the Sticker Sheet, one per page (Homepage, UX/UI,
Graphic, Fine Arts, About Me). Each is 290 × 880 with three vertical
regions: logo top (60 px top padding) → menu center → footer block with
LinkedIn + Behance icons + email + 1 px hairline divider.

A single sidebar markup pattern is enough — the page sets
`aria-current="page"` on the appropriate `.menu-button`, and CSS handles
both the Pressed visual and the dropdown expansion.

### 5.5 Other reusable components

- `.logo-mark` — wordmark; `--text-logo-desktop` (sidebar) or
  `--text-logo-mobile` (topbar) selected via the breakpoint
- `.topbar` — mobile header, **82 px tall, 30 px top padding, 36 px side
  padding**. Single-line logo left + 26 × 14 hamburger right
- `.menu-trigger` — hamburger built from two pseudo-element bars (no SVG
  required); animates to × via `aria-expanded` (A6)
- `.mobile-menu` — full-width slide-down panel; items use the same
  `.menu-button` Large variant as the sidebar
- `.social-icons` — flex row of two 24 × 24 SVG anchors
- `.email-link` — `mailto:` anchor with `--text-meta-email`
- `.divider` — horizontal hairline using `border-top` (no SVG)
- `.project-section` — repeating layout (left text column + right image
  on desktop; centered single column on mobile). Optional colored band
  via modifier classes `.project-section--artura`,
  `.project-section--catwalk`, `.project-section--amz`,
  `.project-section--naturellement`
- `.showcase-image` — full-bleed image strip between project sections
- `.experience-item` / `.education-item`
- `.education-item__avatar` — circular image; size from
  `--avatar-size-desktop|mobile`
- `.skill-group` — uppercase subtitle + items; **mobile recolors the
  subtitle to `--color-primary`** (deliberate, observed in mobile frame)
- `.gallery-tile` — masonry tile in Fine Arts grid

---

## 6. Animations / transitions (CSS-only unless noted)

Defined in `css/animations.css`. All non-essential motion suppressed under
`@media (prefers-reduced-motion: reduce)`.

| ID | Effect | Trigger | Approach |
|---|---|---|---|
| A1 | Sidebar / menu link hover | `:hover`, `:focus-visible` | Color → `--color-primary`, padding-inline +10 px (matches Sticker Sheet Hovered state); `transition: 250 ms` |
| A2 | Active page indicator | `[aria-current="page"]` | Right-aligned, no transition |
| A3 | Case Study button hover | `:hover`, `:focus-visible` | Background → `--color-primary`, color → `--color-on-primary`, 200 ms |
| A4 | Case Study button pressed | `:active` | 0.97 scale, 100 ms |
| A5 | Social icon hover | `:hover` | `currentColor` → `--color-primary`, 150 ms |
| A6 | Hamburger morph | `aria-expanded` toggled by JS | Pseudo-element bars rotate to ×, 300 ms |
| A7 | Mobile dropdown open | Same toggle | `max-height` 0 → 100 vh + opacity 0 → 1, 300 ms |
| A8 | Project section reveal | `IntersectionObserver` | Add `.is-visible`; CSS `fade-up` keyframe (12 px translate + opacity), 600 ms once. `<noscript>` fallback applies the class statically |
| A9 | Fine Arts tile hover | `:hover` | 1.02 scale + slight brightness, 400 ms |
| A10 | Reduced motion | `@media (prefers-reduced-motion: reduce)` | All transitions ≤ 0 ms; A8 disabled (sections start visible) |

---

## 7. Responsive strategy

- **Desktop-first**. Default styles target 1920 px; layout is fluid up to
  that width.
- **Single primary breakpoint**: `@media (max-width: 900px)`. Below 900 px
  the 290 px sidebar is replaced by the 82 px topbar + slide-down
  dropdown; project sections collapse to a centered single column;
  typography re-picks from the scale per §4; education avatars shrink to
  36 px; all gutters shift to `--mobile-gutter` (36 px); inter-section
  gap becomes 64 px.
- 390 px → 900 px scales fluidly via `clamp()` paddings and `width: 100%`
  images.
- 900 px → 1920 px uses `max-width: 1920px; margin-inline: auto;` with
  side gutters.
- > 1920 px keeps the layout centered.

---

## 8. Asset manifest

Naming: kebab-case. Icons are SVG. Photographs and project art are
**WebP with a PNG fallback** wrapped in `<picture>`. Developer exports
each asset manually from Figma; HTML/CSS already reference the paths.

### 8.1 Icons — `assets/icons/`

| File | Source | Notes |
|---|---|---|
| `linkedin.svg` | sidebar/topbar `LinkedIn` | mono — fill `currentColor` so A5 works |
| `behance.svg` | sidebar/topbar `Behance` | same |
| `menu.svg` | `Menu` 26 × 14 frame | optional — can be CSS bars |

### 8.2 Homepage — `assets/images/home/`

| File | Figma layer |
|---|---|
| `hero-shoe.{webp,png}` | `Frame 2` (red shoe collage) |
| `hero-dali.{webp,png}` | `Frame 3` (Salvador Dalí print) |

### 8.3 UX/UI Design — `assets/images/ux-ui/`

| File | Project |
|---|---|
| `artura-mockup.{webp,png}` / `artura-showcase.{webp,png}` | Artura |
| `snagie-devices.{webp,png}` | Snagie |
| `e-sharp-mockup.{webp,png}` / `e-sharp-showcase.{webp,png}` | E-Sharp |

### 8.4 Graphic Design — `assets/images/graphic/`

| File | Project |
|---|---|
| `dali-mockup.{webp,png}` / `dali-showcase.{webp,png}` | Salvador Dalí Exhibition |
| `catwalk-mockup.{webp,png}` / `catwalk-showcase.{webp,png}` | CatWalk |
| `tinel-mockup.{webp,png}` / `tinel-gallery-1.{webp,png}` / `tinel-gallery-2.{webp,png}` / `tinel-gallery-3.{webp,png}` | Tinel |
| `naturellement-mockup.{webp,png}` / `naturellement-showcase.{webp,png}` | Naturellement |
| `amz-showcase.{webp,png}` | Archeological Museum Zadar (band-only hero) |
| `time-mockup.{webp,png}` / `time-showcase.{webp,png}` | Time |
| `toto-mockup.{webp,png}` / `toto-showcase.{webp,png}` | Toto Travel |

### 8.5 Fine Arts — `assets/images/fine-arts/`

| File | Source |
|---|---|
| `gallery-01.{webp,png}` … `gallery-05.{webp,png}` | Mansory gallery → Frame 3 / 4 / 6 / 7 / 9 |
| `gallery-06.{webp,png}` …  | Additional tiles by developer (continuous gallery) |

### 8.6 About Me — `assets/images/about/`

| File | Source |
|---|---|
| `portrait.{webp,png}` | Headline → Right container |
| `edu-arts-academy.{webp,png}` | Education item 1 (Master of Arts) |
| `edu-algebra.{webp,png}` | Education item 2 (Algebra University) |
| `edu-coursera.{webp,png}` | Education item 3 (Google UX/UI / Coursera) |

---

## 9. JavaScript (single `js/main.js`, two responsibilities)

Total under 60 lines. Loaded with `defer`. No frameworks.

1. **Mobile menu toggle (required).** Drives `aria-expanded` on the
   `<button>` controlling `<nav id="mobile-menu">`. Toggles a class on
   `<body>` so CSS animates the hamburger and panel. Closes on `Escape`
   and on link click.

   Why JS: a `<button aria-expanded>` cannot be reliably and accessibly
   driven by CSS-only patterns (`:target`, `<details>`, checkbox hack)
   without breaking keyboard nav, history, or trigger styling.

2. **Scroll reveal (progressive enhancement).** A small
   `IntersectionObserver` adds `.is-visible` to `[data-reveal]` on first
   intersection. Skipped under `prefers-reduced-motion: reduce`. A
   `<noscript><style>` block applies `.is-visible` to all `[data-reveal]`
   so content stays visible without JS.

No analytics, smooth-scroll polyfills, or animation libraries.

---

## 10. Accessibility baseline

- Semantic landmarks: `<header>` (mobile only), `<aside aria-label="Primary">`
  (desktop sidebar), `<main>`, optional `<footer>`.
- `aria-current="page"` on the active sidebar link drives the Pressed
  visual and the UX/UI dropdown expansion.
- Mobile trigger uses `aria-expanded` + `aria-controls`.
- Decorative images: `alt=""`. Portrait + project art: descriptive alt.
- `:focus-visible` outline uses `--focus-ring`; bare `:focus` suppressed
  for mouse users.
- `prefers-reduced-motion` honored (A10).
- Skip-link `<a class="skip-link" href="#main">` first in `<body>`.
- Contrast notes:
  - `#3A3733` on `#ECECEC` — 9.6:1 (AAA).
  - `#7A7A7A` on `#ECECEC` — 3.4:1; only used at 14 px-bold-uppercase or
    larger (passes AA-large). Flagged in §12.
  - White on `#C4502A` (hover button) — 4.4:1 (passes AA normal text).

---

## 11. Open items / things to confirm

1. **Tablet range (390 px → 900 px).** No tablet frame exists. Plan is
   fluid mobile up to 900 px. Confirm acceptable, or specify a second
   breakpoint.
2. **Mobile skill subtitle in primary color.** The mobile About Me frame
   recolors skill subtitles to `--color-primary` (`#C4502A`) instead of
   the muted `#7A7A7A` used on desktop. Plan reproduces this. Confirm
   intentional (it's a clear color shift from desktop).
3. **`--text-headline-xsmall` (16 px Unbounded Medium).** Used inside
   mobile job/education/skill cards but not on the Sticker Sheet.
   Treating it as an undocumented mobile-only token. Confirm or rename.
4. **Hover indent on sidebar.** The Sticker Sheet's Hovered Menu Button
   adds 10 px of horizontal padding to the inner label container,
   creating a subtle indent. Plan reproduces it. Confirm intentional.
5. **Homepage hero artwork.** Per the design's noted exception, the
   homepage is missing visual content. Plan lays out the two-image grid
   sized to the Figma frames as placeholders.
6. **Fine Arts gallery length.** Per the design's noted exception,
   mobile is unfinished. Plan mirrors the desktop masonry as a single
   column on mobile and exposes a clearly-marked slot for additional
   tiles.
7. **Mobile menu visual.** Per the design's noted exception (no design
   exists), plan proposes a full-width slide-down panel using
   `--color-surface` with 1 px hairline dividers and the same
   `.menu-button` styles as the sidebar.
8. **Font hosting.** Plan uses Google Fonts via `<link>` for Manrope and
   Unbounded. Confirm — alternative is self-hosting WOFF2 for stronger
   privacy and fewer third-party requests.
9. **Muted-text contrast.** `#7A7A7A` on `#ECECEC` is 3.4:1, borderline.
   Used only at 14 px-bold-uppercase or larger so passes AA-large; if
   stricter contrast is desired, darken to e.g. `#5A5A5A`.

---

## Critical files this plan will touch

- **Create:** every file in §1's tree (HTML × 5, CSS × 5, JS × 1, `.nojekyll`).
- **Read-only references:** Figma file `nb4xDttczmwlSC7if3zJ9R`,
  Sticker Sheet canvas `813:387`, Design canvas `0:1`.

No existing files in the working tree are modified.