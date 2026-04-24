# Design Brief

## Tone & Direction
Premium, maximalist-refined event ticketing. Bold vibrant colors, clean editorial layouts, visual-first with strong typography hierarchy. Users engage with joy and confidence.

## Palette
| Token | OKLCH Light | OKLCH Dark | Purpose |
|-------|-------------|-----------|---------|
| Primary | `0.60 0.20 275` | `0.72 0.20 275` | Purple: signature branding, hero sections, primary CTAs |
| Secondary | `0.72 0.22 52` | `0.80 0.22 52` | Orange: CTA energy, highlights, booking actions |
| Accent | `0.58 0.18 254` | `0.68 0.18 254` | Blue: supporting interactions, secondary actions |
| Background | `0.98 0 0` | `0.13 0 0` | Base surface |
| Card | `0.99 0 0` | `0.17 0 0` | Elevated content, event cards |
| Muted | `0.92 0 0` | `0.22 0 0` | Secondary backgrounds, dividers |
| Foreground | `0.20 0 0` | `0.96 0 0` | Primary text |

## Typography
- **Display:** Space Grotesk (bold, geometric) — headlines, event titles, hero text
- **Body:** Plus Jakarta Sans (warm humanist) — descriptions, UI labels, body copy
- **Mono:** JetBrains Mono (crisp technical) — prices, times, event codes

## Shapes & Spacing
- **Radius:** Primary `0.75rem` (friendly modern), sharp `0` for buttons, emphasis `1.5rem` for featured cards
- **Spacing:** 4-level scale (4px, 8px, 16px, 24px) for rhythm and hierarchy
- **Shadows:** `card` (4px, 8% opacity), `elevated` (12px, 12% opacity), `accent` (purple glow effect 15% opacity)

## Structural Zones
| Zone | Light Background | Dark Background | Treatment |
|------|------------------|-----------------|-----------|
| Header/Nav | `0.98 0 0` card | `0.17 0 0` card | Border-b in `--border`, purple logo accent |
| Hero/Featured | Primary gradient overlay | Primary darker overlay | Layered imagery with white text, `shadow-elevated` |
| Content Grid | `0.98 0 0` background | `0.13 0 0` background | Alternating `bg-card` and `bg-muted/30` sections |
| CTA Sections | `0.72 0.22 52` (orange) | `0.80 0.22 52` (orange) | White text, `shadow-accent`, bold typography |
| Footer | `0.92 0 0` (muted) | `0.22 0 0` (muted) | Border-t, purple accent for links |

## Component Patterns
- **Event Cards:** Elevated card with hero image, purple gradient text overlay, sharp corners on top, rounded corners `lg` on bottom
- **Buttons:** Primary (purple bg, white text), Secondary (orange bg), Tertiary (outline, blue border)
- **Search Bar:** Muted background, purple ring on focus, placeholder text in `--muted-foreground`
- **Sticky Booking Bar:** Fixed bottom, orange background, white text, `shadow-elevated`
- **Countdown Timer:** Mono font, bold orange text, updated per event

## Motion
- **Entry:** `animate-slide-up` on card mounts (0.4s ease-out)
- **Interactions:** `transition-smooth` (0.3s cubic-bezier) on hover/focus states
- **Hover:** Slight scale (1.02x) on interactive cards, orange glow on primary buttons
- **Load States:** `animate-fade-in` on content sections

## Constraints
- All colors token-only (no raw hex/rgb)
- No color-mixing functions
- Maximum 3 accent colors per page
- High contrast foreground-on-background (L difference ≥0.7)

## Signature Detail
Purple as undeniable signature (hero overlays, primary buttons, logo). Orange energy accents create momentum toward booking. Editorial card layouts with hero imagery treated as design elements, not afterthoughts. Every surface intentional depth.
