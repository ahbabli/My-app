# Ahmed Albabli portfolio design system

## 1. Direction

An Instagram-inspired portfolio surface with a near-black canvas, cool cyan accents, compact social-profile rhythms, and image-first project tiles. Improvements should sharpen hierarchy and feedback without changing the recognizable profile/grid structure.

## 2. Color tokens

- `ink`: `#05060d` — page and primary surface.
- `surface`: `#080a12` — elevated dialogs, cards, and form controls.
- `mist`: `#abced6` — secondary copy and quiet controls.
- `cyan-brand`: `#45b2ca` — primary action, focus, and identity color.
- `ice`: `#f3fdff` — high-emphasis cool white.
- White opacity steps (`3.5%`, `10%`, `15%`) provide surface and border hierarchy.

## 3. Typography

- Body and display: Ubuntu, with system sans-serif fallback.
- Filters and compact uppercase metadata: AR One Sans.
- Headings use bold weight, tight leading, and sentence case.
- Body copy uses relaxed enough leading for small mobile sizes and `mist` contrast.

## 4. Spacing and shape

- Base spacing unit: 4px.
- Mobile content padding: 20px; larger surface padding: 35–48px.
- Main profile surface radius: 28px tablet, 36px desktop.
- Controls use 8–10px corner radii; story/profile elements remain circular.
- Project media stays square and grid gaps remain intentionally compact.

## 5. Reusable primitives and states

- `ProfileSurface`: dark raised container; edge definition only on non-edge-to-edge breakpoints.
- `PrimaryAction`: cyan fill, white label, visible hover/press/focus states.
- `SecondaryAction`: mist or translucent fill, dark/white label by context.
- `StoryButton`: circular identity control with cyan glow, hover lift, pressed reset, and keyboard ring.
- `ProjectCard`: square media tile with hover/focus overlay; title and engagement metadata remain readable.
- `FilterTab`: top rule indicates selected state; inactive labels remain subdued but accessible.
- `ModalStory`: centered, image-led dialog with dismiss button, backdrop dismissal, and Escape support.
- `EmptyState`: composed inline message with an action that restores the full project grid.

## 6. Motion

- Transitions are short (150–300ms), limited to opacity, color, transform, and filter.
- Interactive controls lift or scale only to communicate clickability and return on press.
- `prefers-reduced-motion` disables smooth scrolling and non-essential transitions/transforms.

## 7. Responsive behavior

- Mobile: edge-to-edge profile and three-column project grid.
- Tablet: rounded centered surface and increased spacing.
- Desktop: two-column profile composition within a 1120px surface; projects remain below.
- Tap targets should be at least 40px and essential content must not depend on hover.

## 8. Accessibility and accepted debt

- Cyan focus rings remain visible against `ink`; keyboard skip navigation is provided.
- Dialogs close with Escape and backdrop click, move focus inside, contain keyboard focus, and restore focus to their trigger.
- Google-hosted font loading remains accepted debt; system fallbacks keep content readable.
