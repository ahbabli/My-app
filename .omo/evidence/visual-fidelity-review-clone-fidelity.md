# Clone / design-system fidelity review

**Goal reviewed:** Preserve the dark/cyan, Instagram-like portfolio rhythm while adding tasteful polish and an SVG favicon.

**Recommendation:** REQUEST_CHANGES

## Evidence inspected

- Fresh production captures: `app-frontend/.qa/home-500.png` (500x812, 2026-09-01 19:04), `home-768.png` (768x1024, 19:03), and `home-1280.png` (1280x900, 19:03).
- Required narrow-mobile companion capture: `app-frontend/.qa/home-375.png` (375x812, 19:03).
- Visual baseline packet: `insta-desktop.png`, `insta-mobile.png`, `insta-mobile-tall.png`, and `insta-projects.png`.
- Implementation: `app-frontend/DESIGN.md`, `src/App.jsx`, `src/index.css`, `src/components/ProfileSurface.jsx`, `ProfileHeader.jsx`, `Stats.jsx`, `Skills.jsx`, `ProjectsSection.jsx`, `ProjectCard.jsx`, `index.html`, and `public/favicon.svg`.

## Findings

### CRITICAL

None. The core UI is a live React component tree: `App` composes `ProfileSurface` and `ProjectsSection`, which in turn render reusable header, statistics, skills, tab, and project-card components. The raster assets are limited to legitimate avatar/story/project media; they are not a page screenshot substituted for UI.

### HIGH

1. **[product] 375px responsive overflow clips essential UI.** `home-375.png` visibly cuts off the right side of the profile name, CV action, third statistic, third skill, and project tiles. This violates the stated mobile, edge-to-edge responsive contract and means the surface is not safely usable at the required 375px viewport. The breakpoint composition begins at `ProfileHeader.jsx:30`, with an inflexible `108px` column and content/actions that collectively establish a wider intrinsic minimum; `ProfileSurface.jsx:8` then hides the resulting overflow. The desktop/tablet captures do not expose this defect, but it blocks approval because 375px is a required QA width.

### MEDIUM

1. **[design-system] Token enforcement is incomplete.** The declared palette is sound in `src/index.css:4-11`, but several new global styles bypass those tokens with repeated literal color values (`index.css:14,20,24-25,35-36,44,50,59-60`). The use is visually coherent, not a screenshot fake, but it contradicts `DESIGN.md`'s claim that named tokens drive the visual system and makes later palette changes less reliable. Use the exported token/custom-property layer (or token-derived color mixing) for global chrome as well.

### LOW

1. **[product] The 1280px card has a very restrained edge.** `home-1280.png` is visually clean and keeps the baseline two-column rhythm, but its very low-contrast border is mostly imperceptible against the canvas. This is an acceptable subtle treatment, not a blocker; preserve it only if the intended elevated surface remains distinguishable on calibrated dark displays.

## What holds up

- The fresh 500px, 768px, and 1280px captures maintain the dark/cyan palette, social-profile hierarchy, circular story affordances, tab rule, and image-first grid from the baseline without flattening the experience.
- Component reuse is real and extensible (`ProfileSurface`, `ProfileHeader`, `Stats`, `Skills`, `ProjectsSection`, and `ProjectCard`), rather than a pasted or background-image page.
- At 500px the profile has an appropriate compact rhythm; at 768px it becomes a centered rounded surface; at 1280px it resolves into a strong two-column composition. No clipping is visible at those three supplied widths.
- The favicon is a lightweight, live SVG that uses the established palette (`public/favicon.svg:1-13`), and `index.html:12` correctly references it.

## Blockers before approval

1. Make the 375px profile layout reflow within the viewport (and recapture it) so all essential content is visible and reachable without horizontal clipping.
2. Bring the newly added global colors under the defined token layer to retain the documented token-driven system.
