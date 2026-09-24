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
3. **Internal candidates** (future recruiters): excited, Gen Z energy.

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

**Internal candidates (Careers)**: excited, Gen Z, a little bold. Short punchy lines, casual words ("seriously", "crush it", "on us"), but still clear about pay and requirements.
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
- **RHM Title** (`--font-title`): tall condensed, caps only. Hero headlines and big statements. Line-height ~1.0, tracking 0.03 to 0.04em. Keep to 1 to 3 lines.
- **Josefin Sans** (`--font-display`): geometric, echoes the "STAFFING SOLUTIONS" wordmark. Section headings (600, sentence case), eyebrows (600, 13px, 0.18em tracking, uppercase), card titles.
- **Google Sans** (`--font-body`): body, UI, buttons, forms.

**Backgrounds.** Heroes and feature bands use full-bleed **grain gradient photos** (navy to cobalt to sky, heavy film grain) from `assets/backgrounds/`. Always add `--gradient-protect` (ink to transparent, left to right) over them so white text passes contrast. **Line-wave art** (`assets/lines/`) is the signature motif: fine parallel lines forming ribbons. White waves on dark at 30 to 50% opacity, blue waves on white or light gray at ~35%. Bleed them off an edge; never center them behind body text. **Glass** textures (fluted, pixel glass) suit the Careers page and dark bands. White sections alternate with `--surface-subtle` gray. No hand-drawn illustration, no patterns other than the line waves.

**Imagery vibe.** Cool, blue, grainy, abstract. No warm tones. No people photos were supplied; when real photos are added, prefer real job sites and cool color grading.

**Spacing + layout.** 4px base scale (`--space-1` to `--space-10`). 1200px container, 32px side padding, 96px section padding. Common splits: 5/7 heading and copy, 4-up card grids, 1/1 split cards. Header is sticky white, 76px, gains a hairline + small shadow on scroll.

**Corners.** Mostly squared, matching the logo's hard edges. Buttons and inputs 4px, badges 2px, cards and dialogs 8px, tags/chips pill. Nothing heavily rounded.

**Cards.** White with 1px `--border-subtle` and 8px radius (outline); `elevated` swaps the border for `--shadow-md`; `tint` uses `--blue-50`; `dark` is navy; `glass` is 10% white with 16px backdrop blur for use on grain photos. Icon sits in a 44px tinted square. No colored left-border accents.

**Shadows.** Soft and navy-tinted (`--shadow-sm/md/lg`). Used for elevated cards, dialogs, toasts and sticky header. Focus uses a 3px Sky ring (`--shadow-focus`).

**Borders.** 1px hairlines for cards and dividers; 1.5px for form controls and outline buttons.

**Transparency + blur.** Only on dark/photo surfaces: glass cards, white-on-dark borders (`--border-on-dark` 18% white), dialog scrim (ink at 60%).

**Motion.** Quick and calm. 120ms for presses and focus, 200ms for hover color, 400ms max. Easing `--ease-standard` / `--ease-out`. No bounces, no parallax, no looping animation.

**Hover / press.** Buttons darken one ramp step (Blue 500 to 600) or gain a light blue wash (secondary / ghost). Interactive cards lift 2px with `--shadow-lg` and a blue-200 border. Links go from RHM Blue to Navy with underline. Press nudges buttons down 1px.

---

## ICONOGRAPHY
- RHM supplied **no icon set**. The system uses **Lucide** (outline, 2px stroke, round caps) loaded from CDN (`lucide-static@0.460.0`) via the `Icon` component, which masks the SVG so it takes `currentColor`. **This is a substitution; swap in an official set if one exists.**
- Sizes: 16 to 20px inline, 22px inside card icon squares, 24 to 28px in feature rows.
- Color: RHM Blue on light, Sky on dark.
- **No emoji. No unicode symbols as icons.** The only brand graphics are the logo PNGs and line-wave PNGs.
- Useful industry icons: `hard-hat`, `wrench`, `drafting-compass`, `cpu`, `building-2`, `factory`, `flask-conical`. Process: `phone`, `users`, `clipboard-check`, `shield-check`. Benefits: `wallet`, `heart-pulse`, `smile`, `eye`, `life-buoy`.

---

## Index
- `styles.css`: entry point (imports only)
- `tokens/`: `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
- `fonts/`: RHM_Title, Josefin Sans, Google Sans (TTF)
- `assets/logo/`: `rhm-horizontal-blue.png`, `rhm-horizontal-white.png`
- `assets/backgrounds/`: grain (navy-sky, cyan-streak, cobalt-glow, cream-wave, midnight-arc, midnight-streak), glass (glass-texture, fluted-glass), fluid (blue-wave, blue-violet), soft blobs (blue, cyan)
- `assets/lines/`: wave-blue-01..03, wave-cyan-01, wave-black-01, wave-white-01..06, wave-white-wide-01..02
- `assets/reference/`: original palette sheet
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
