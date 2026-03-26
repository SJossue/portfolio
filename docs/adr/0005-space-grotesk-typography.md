# ADR 0005: Space Grotesk Typography

**Status**: Accepted
**Date**: 2026-03-24
**Deciders**: Project owner

## Context

The scroll portfolio uses JetBrains Mono (monospace) for all text — headings, body, labels, everything. While this reinforces the terminal/cyberpunk aesthetic, monospace fonts are harder to read at body text sizes and make the scroll experience feel monotonous compared to modern portfolio sites.

## Decision

Add **Space Grotesk** as the primary sans-serif font for headings and body text. Retain **JetBrains Mono** for code snippets, tech labels, terminal-style decorative elements, and the `//` section prefixes.

## Rationale

- **Geometric precision**: Squared terminals and monolinear strokes echo the mechanical engineering identity while being far more readable than monospace for running text
- **Natural pairing**: Both Space Grotesk and JetBrains Mono share geometric DNA, creating visual harmony
- **Zero JS bundle cost**: Loaded via `next/font/google` which self-hosts the font files as static assets — no runtime JavaScript added
- **Small file size**: ~25 KB woff2 variable font file
- **Google Fonts**: Free, well-hinted, excellent browser support

### Alternatives Considered

| Alternative              | Why Not                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| Inter                    | Industry standard but generic — doesn't stand out for a portfolio       |
| Outfit                   | Rounder terminals feel less "engineered"                                |
| Sora                     | Slightly larger file size, less distinctive pairing with JetBrains Mono |
| Keep JetBrains Mono only | Readability suffers at body sizes, experience feels flat                |

## Consequences

- Space Grotesk loaded alongside JetBrains Mono in `layout.tsx` via `next/font/google`
- CSS variables: `--font-sans` (Space Grotesk) + `--font-mono` (JetBrains Mono)
- Tailwind config extended with `fontFamily.sans`
- Body default changes from `font-mono` to `font-sans`
- Components that need monospace explicitly apply `font-mono` class
