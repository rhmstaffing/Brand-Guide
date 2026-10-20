[readme.md](https://github.com/user-attachments/files/33729233/readme.md)
# RHM Staffing Solutions Design System

Brand foundations, components and a website UI kit for **RHM Staffing Solutions**, a U.S. staffing firm with offices across the country.

## Company context

- **What they do:** place people in jobs. Temporary staffing, temp to hire, and direct hire.
- **Industries:** Light Industrial, Skilled Trades, Engineering, Embedded Engineering, Architecture Construction, Manufacturing, Life Sciences.
- **Taglines** (use the one that matches the audience, exact wording, Title Case not required):
  - Brand / core idea: "The best talent won't come to you, we bring them to you."
  - Clients (account executive collateral): "Partner with us today to build the workforce that powers your tomorrow."
  - Contractors and job seekers (external recruiting): "Connecting passionate people with unlimited opportunities."
  - Internal hiring (talent acquisition, future recruiters and AEs): "Turning potential into opportunity, one hire at a time." or "Build your future with a team that invests in your success."
- **Sourcing:** referrals, passive seekers, technical schools, community partnerships, partnerships with closing companies, core skillset targeting.
- **Screening:** 4 steps for every role: phone screen, in-person interview, orientation, reference checks. Consistent across all roles.
- **Onboarding:** payroll, benefits, compliance, orientation. Compliance support: E-Verify, workers' comp, drug and background checks.
- **Client value:** retention, conversion eligibility, time to fill. Market salary benchmarks, weekly touchpoints, performance reviews, walk-ins, no large upfront fees, capacity for large-scale hiring. Tools: referral programs, tech school partnerships, Salesforce.
- **Contractor benefits** (30+ hrs/week): weekly pay, BCBS of Illinois medical (HSA compatible option), Guardian dental and vision, 24/7 EAP, dependents to age 26, Blue365 discounts.
- **Internal recruiting (Careers):** entry level (0 to 1 yrs), sales-based. Base + uncapped commission + bonus, on-the-job training, fast track to leadership, incentive trips, benefits, 401(k) match.

### Audiences / surfaces

1. **Clients** (hiring managers, HR, ops leaders): direct, useful, conversational.
2. **Contractors** (job seekers): direct, plain, friendly.
3. **Internal candidates / TA** (future recruiters and AEs): loud, bright, pop culture, Gen Z energy.

The only product surface built here is a **marketing website** (`ui_kits/website/`). No existing site code, Figma or decks were provided.

## Sources provided

All uploaded to this project (originals in `uploads/`):

- Logos: `RHM Blue Horizontal.png`, `White Horizontal.png`
- Palette: `RHM Color Palette.jpeg` (Adobe Color export, 5 swatches)
- Fonts: `RHM_Title.ttf`, Josefin Sans variable (+ italic), Google Sans variable (+ italic)
- Imagery: Adobe Stock grain / glass / fluid backgrounds and line-wave artboards (`Artboard 2 copy` to `Artboard 12_2`)
- Company brief (pasted text, summarized above)
- Not received (listed but missing from uploads): `AdobeStock_1711692917.png`, `AdobeStock_2067250090.png`, `AdobeStock_1729274264.jpeg`, `blue gradient background with glass effect.jpeg`

---

## CONTENT FUNDAMENTALS

**Global rules**

- **No emoji. No em dashes.** Use a period, comma, colon or "to" instead ("$19 to $21/hr", "0 to 1 years").
- Simple words, short sentences. Easy to read on a phone in a warehouse break room.
- Conversational but direct. Get to the point in the first line.
- Speak as **we** (RHM) to **you** (reader). Never "the candidate" or "the client" in customer-facing copy.
- Sentence case for headings in Josefin Sans. UPPERCASE only in the RHM Title face and eyebrows.
- Numbers as digits: "4 steps", "30+ hours", "24/7".
- Contractions are fine and encouraged: we'll, you're, won't.

**Clients (sales facing)**: direct, confident, valuable info first. Lead with the outcome, then the proof.

- "Skilled people. Less hassle."
- "We handle sourcing, screening, onboarding and payroll. You get people ready to work."
- "No large upfront fees. Scale up or down week to week."

**Contractors (sales facing)**: plain, warm, benefit first. Say what they get and when.

- "Get paid every week."
- "Real benefits for anyone working 30+ hours."
- "We text first. It's faster."

**Internal candidates / TA (Careers)**: loud, bright and in your face, but direct. Built for short attention spans: hook in the first 3 words, one idea per line, numbers up front. Lean on current pop culture (memes, slang, trending formats, "main character energy", "POV:", "it's giving") while keeping pay and requirements crystal clear. Refresh references often; stale slang is worse than none. TA can use every brand font (RHM Title, Josefin Sans, Google Sans) plus **RHM Subtitle** for big numbers and shouty subtitles. Brightest palette: Sky and Blue on Ink, full saturation, high contrast.

- "POV: your commission has no ceiling."
- "Entry level. Uncapped pay. Read that again."
- "It's giving incentive trip."

- "No cap on commission. Seriously."
- "Zero to one year of experience? Perfect."
- "Top performers travel. On us."
- "Future you says thanks."

**Client collateral (AEs):** write to one buyer persona at a time: Hiring Manager, Department Director, HR / TA, Procurement, Finance, MSP Program Manager or Executive Sponsor. Lead with what that person cares about and cut what they don't (e.g. never pitch recruiting process to Finance or company history to a Hiring Manager). Full care / don't-care matrix in `guidelines/audiences.md`. Job seeker content leads with resume help, interview prep, offer negotiation and career growth. Internal hiring leads with earning potential, career path and culture.

**CTAs:** short verb phrases. "Request talent", "Find a job", "Apply now", "Talk to a recruiter", "See open jobs". Avoid "Learn more" and "Submit".

---

## VISUAL FOUNDATIONS

**Color.** Five brand colors: Ink `#060F1A`, Navy `#02195C`, RHM Blue `#084FA3`, Sky `#52C0E4`, Silver `#BEC3C8`. Navy is the logo color and main heading color. RHM Blue is the primary action color. Sky is the accent: eyebrows on dark, focus rings, the loudest CTA on dark heroes. Ink is the deepest surface (footer, dark sections). Neutrals are cool grays built off Silver. Status colors (green, amber, red) are only for UI states, never decoration. Blue and Sky ramps are derived tints (`tokens/colors.css`).

**Type.**

- **RHM Title** (`--font-title`): tall condensed, caps only. Hero headlines and big statements. Line-height \~1.0, tracking 0.03 to 0.04em. Keep to 1 to 3 lines.
- **Josefin Sans** (`--font-display`): geometric, echoes the "STAFFING SOLUTIONS" wordmark. Section headings (600, sentence case), eyebrows (600, 13px, 0.18em tracking, uppercase), card titles.
- **Google Sans** (`--font-body`): body, UI, buttons, forms.
- **RHM Subtitle** (`--font-subtitle`, regular + italic): **reserved for TA / internal hiring.** Big stat numbers ("$0 cap", "0-1 yrs") and loud attention-grabbing subtitles. Not for client or contractor pieces.
- **Who uses what:** client and contractor pieces use RHM Title, Josefin Sans and Google Sans. TA / internal hiring can use **all four**: RHM Title, Josefin Sans, Google Sans and RHM Subtitle.

**Backgrounds.** Heroes and feature bands use full-bleed **grain gradient photos** (navy to cobalt to sky, heavy film grain) from `assets/backgrounds/`. Always add `--gradient-protect` (ink to transparent, left to right) over them so white text passes contrast. **Line-wave art** (`assets/lines/`) is the signature motif: fine parallel lines forming ribbons. White waves on dark at 30 to 50% opacity, blue waves on white or light gray at \~35%. Center them behind body text, never show edges of the lines. **Glass** textures (fluted, pixel glass) suit the Careers page and dark bands. White sections alternate with `--surface-subtle` gray. No hand-drawn illustration, no patterns other than the line waves.

**Edges (hard rule).** Lines, soft blobs and fluid shapes never show a cut edge. Either run them edge to edge off the document (bleed past every side they touch) or fade them out with `--mask-fade-edges`, `--mask-fade-x` or `--mask-fade-y` (classes `.rhm-fade-edges`, `.rhm-fade-x`, `.rhm-fade-y`). A visible rectangle edge on a wave or blob is always wrong.

**Parallelograms + angles.** All of RHM can use angled shapes taken from the logo's diagonal cuts (about 32deg off vertical, leaning "\" top-left to bottom-right like the R leg and M strokes; `skewX(var(--skew-logo))`, softer `--skew-soft` 16deg; clip presets approximate the lean). Use for image frames (`--clip-parallelogram`), color bands, stat tiles and section dividers. No accent slashes. Text inside an angled shape stays left aligned but follows the slant: float a spacer with `shape-outside:polygon(0 0,0 0,100% 100%,0 100%)` as wide as the cut so each line starts further right, and a matching right-side float (`polygon(0 0,100% 0,100% 100%,100% 100%)`) for the right cut. Keep 15px clear space on all sides of the text, measured from the angled edges. Keep angles consistent within a piece; don't mix directions.

**Imagery vibe.** Cool, blue, grainy, abstract. No warm tones. No people photos were supplied; when real photos are added, prefer real job sites and cool color grading.

**Spacing + layout.** 4px base scale (`--space-1` to `--space-10`). 1200px container, 32px side padding, 96px section padding. Common splits: 5/7 heading and copy, 4-up card grids, 1/1 split cards. Header is sticky white, 76px, gains a hairline + small shadow on scroll.

**Corners.** Mostly squared, matching the logo's hard edges. Buttons and inputs 4px, badges 2px, cards and dialogs 8px, tags/chips pill. Nothing heavily rounded. Angled cuts (parallelograms) are welcome.

**Cards.** White with 1px `--border-subtle` and 8px radius (outline); `elevated` swaps the border for `--shadow-md`; `tint` uses `--blue-50`; `dark` is navy; `glass` is 10% white with 16px backdrop blur for use on grain photos. Icon sits in a 44px tinted square. No colored left-border accents.

**Shadows.** Soft and navy-tinted (`--shadow-sm/md/lg`). Used for elevated cards, dialogs, toasts and sticky header. Focus uses a 3px Sky ring (`--shadow-focus`).

**Borders.** 1px hairlines for cards and dividers; 1.5px for form controls and outline buttons.

**Transparency + blur.** Only on dark/photo surfaces: glass cards, white-on-dark borders (`--border-on-dark` 18% white), dialog scrim (ink at 60%).

**Liquid glass.** For floating UI over photos or grain gradients: nav bars, toolbars, notifications, pill CTAs, round icon buttons. Use the `LiquidGlass` component and `tokens/glass.css`. Recipe (from the Apple Community reference): 24px backdrop blur + 180% saturate, a 0.5px light outer ring, a bright top inner highlight, a dim bottom inner edge, a soft 2-layer drop, and SVG refraction in Chromium. Tones: `dark` (default), `light`, `brand` (blue tint). Radius 28px for panels, pill for buttons and bars. Never place it on flat white; use a normal Card there. Only liquid glass gets a spring on press (scale 0.97); everything else keeps the calm motion rules below.

**Motion.** UI is quick and calm: 120ms presses and focus, 200ms hover color, 400ms max, `--ease-standard` / `--ease-out`. **Looping ambient animation is allowed** on backgrounds and decoration. It should **flow like water and loop seamlessly**: no visible restart, no jumps. **Signature loop: the line ribbon** (`assets/motion/line-wave.js`, `<rhm-line-wave>`): about 18 spaced-out thin white lines (alpha about 0.55) forming one ribbon that fans wide and pinches where it crosses, that undulates and twists in place, runs edge to edge, fades toward the right, 20s loop, over a living gradient: 4 large blurred glows (Ink, Navy, Blue, Sky) drifting on `rhm-flow` loops of 22 to 34s so the colors blend into each other in subtle abstract waves. No hard color stops. Attributes: `lines`, `period`, `amplitude`, `opacity`, `fade`, `color`. Reference: `uploads/New Project_1920x1080.mp4`. Blobs travel a closed circular path (`.rhm-flow`, `.rhm-flow-rev`, first and last keyframe identical); line waves slide as a mirrored strip (A, mirrored A, A, mirrored A, moved -50%) so the seam never shows (`.rhm-current` 40s, `.rhm-wave-slide`); add a slow SVG turbulence ripple (`feTurbulence` + `feDisplacementMap`, baseFrequency animated there and back) for a watery wobble. Also available: slow blob drift (`.rhm-drift`, 24s), floating shapes (`.rhm-float`, 12s), sliding line waves (`.rhm-wave-slide`), soft pulses (`.rhm-pulse`, 6s), all eased with `--ease-loop` and alternating so they never jump. Never loop text or buttons. Reduced motion turns loops off. TA pieces can loop faster and bolder; client pieces stay slow.

**Hover / press.** Buttons darken one ramp step (Blue 500 to 600) or gain a light blue wash (secondary / ghost). Interactive cards lift 2px with `--shadow-lg` and a blue-200 border. Links go from RHM Blue to Navy with underline. Press nudges buttons down 1px.

---

## ICONOGRAPHY

- **Brand icon set (use first).** 32 custom RHM icons from the Brand Guide repo (`rhmstaffing/Brand-Guide`, `components/Icons/`), copied as 128px PNGs to `assets/icons/brand/<style>/<color>/<name>.png`.
  - Styles: `line` (outline only), `solid-circle`, `solid-square`, `tinted-square` (icon on a light tint of its color).
  - Colors: `blue`, `navy`, `sky`, `white`. Use `white` only on dark or photo backgrounds.
  - Names by group: **benefits** (dental, dependents, discounts, eap, medical, vision, weekly-pay), **careers** (401k, commission, fast-track, incentive-trips, training), **client** (benchmarks, compliance, conversion, retention, scale, time-to-fill), **contact** (email, location, phone), **industry** (architecture-construction, embedded-engineering, engineering, life-sciences, light-industrial, manufacturing, skilled-trades), **screening** (interview, orientation, phone-screen, references).
  - Example: `assets/icons/brand/tinted-square/blue/industry-manufacturing.png`.
  - Pick one style per piece and don't mix styles in one row. Tinted square fits light layouts, solid fits heroes and dark bands, line fits dense lists.
  - Gap: `line/sky` is missing benefits-dental, dependents, discounts and eap in the repo. 512px and 1024px sizes exist in the repo if you need print resolution.
- **UI glyphs (fallback).** For small UI icons the brand set doesn't cover (arrows, menu, close, check), the system uses **Lucide** (outline, 2px stroke, round caps) from CDN (`lucide-static@0.460.0`) via the `Icon` component, which masks the SVG so it takes `currentColor`. Never use Lucide where a brand icon exists.
- Sizes: 16 to 20px inline, 22px inside card icon squares, 24 to 28px in feature rows.
- Color: RHM Blue on light, Sky on dark.
- **No emoji. No unicode symbols as icons.** The only brand graphics are the logo PNGs and line-wave PNGs.
- Lucide names for UI glyphs: `arrow-right`, `menu`, `x`, `check`, `chevron-down`, `external-link`.

---

## Index

- `styles.css`: entry point (imports only)
- `tokens/`: `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
- `fonts/`: RHM_Title, RHM Subtitle (regular + italic), Josefin Sans, Google Sans (TTF)
- `assets/motion/line-wave.js`: `<rhm-line-wave>` animated line ribbon (signature loop)
- `tokens/effects.css`: parallelogram clips, edge-fade masks, loop keyframes + utility classes
- `assets/logo/`: `rhm-horizontal-blue.png`, `rhm-horizontal-white.png`
- `assets/backgrounds/`: grain (navy-sky, cyan-streak, cobalt-glow, cream-wave, midnight-arc, midnight-streak), glass (glass-texture, fluted-glass), fluid (blue-wave, blue-violet), soft blobs (blue, cyan)
- `assets/lines/`: wave-blue-01..03, wave-cyan-01, wave-black-01, wave-white-01..06, wave-white-wide-01..02
- `assets/reference/`: original palette sheet
- `assets/icons/brand/`: 32 RHM brand icons, 4 styles x 4 colors, 128px PNG (see ICONOGRAPHY)
- `guidelines/`: specimen cards (colors, type, spacing, brand, content) + `audiences.md` persona messaging guide
- `templates/client-one-pager/`: letter-size client one-pager for AEs, persona switch in Tweaks
- `components/`: React primitives (below)
- `ui_kits/website/`: marketing site click-through
- `SKILL.md`: agent skill entry

### Components

- **brand/**: `Logo`, `Icon`, `SectionHeading`
- **actions/**: `Button`, `IconButton`
- **forms/**: `Input`, `Select`, `Checkbox`, `Radio`, `Switch`
- **display/**: `Card`, `Badge`, `Tag`
- **navigation/**: `Tabs`
- **feedback/**: `Dialog`, `Toast`, `Tooltip`

No source component library existed, so this is a standard set sized to a marketing site. Intentional additions: `Icon` (wraps the Lucide substitute), `SectionHeading` (eyebrow + heading pattern used on every section), `Logo` (safe logo usage).

### UI kits

- `ui_kits/website/`: Home, For clients, For contractors, Careers at RHM, Contact.
