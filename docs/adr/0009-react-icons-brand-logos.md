# ADR 0009: react-icons for Brand Logos

**Status**: Accepted
**Date**: 2026-07-18
**Deciders**: Project owner

## Context

The Garage island's right panel presents the toolbox as a two-column list of the
industry programs and tools worked with (SolidWorks, React, TypeScript, Next.js,
Python, Tailwind, ROS, NVIDIA Jetson, ESP32). Each entry should carry the tool's
recognizable logo, not a hand-rolled monogram. Authoring accurate brand SVG paths
by hand is error-prone (a wrong path renders garbage) and the set may grow.

## Decision

Add **`react-icons`** and consume the **Simple Icons** set via the
`react-icons/si` subpath (`SiReact`, `SiTypescript`, `SiNextdotjs`, `SiPython`,
`SiTailwindcss`, `SiRos`, `SiNvidia`, `SiEspressif`, …). Each icon is a
tree-shakeable React component rendering a single inline `<svg>`, colored via
`currentColor`/`style`. SolidWorks is not in Simple Icons (removed over
trademark), so it uses a small inline SVG mark defined locally.

## Rationale

- **Accuracy**: Official single-path brand marks — no risk of malformed hand-drawn paths.
- **Tree-shakeable**: `react-icons/si` imports only the referenced glyphs; no runtime data fetch, no external network (works within the artifact/CSP posture).
- **Inline SVG**: renders as markup, so logos inherit color, size, and theming; zero image requests, no `next/image` domain config.
- **Maintainable**: adding a tool is one named import, not a pasted path.

### Alternatives Considered

| Alternative                         | Why Not                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| Hand-inlined brand SVG paths        | Error-prone, unaudited path data, painful to extend                |
| Monogram badges (initials in tiles) | Reads as under-designed next to a list of real, named products     |
| `simple-icons` (raw data package)   | Lower-level; would still need per-icon wiring vs. ready components |
| Remote logo CDN / `<img>`           | External network + CSP/domain config; offline/build fragility      |

## Consequences

- `react-icons` added to `dependencies`; only `react-icons/si` glyphs are imported.
- Brand logos live in `GarageIsland.tsx`'s curated `TOOLS` list (label + icon + brand color); SolidWorks carries a local inline SVG.
- The list is a hand-curated presentation subset — generic skills (CAD Modeling,
  FEA, welding, embedded, integration, etc.) stay out of it; those remain in
  `about.ts` for the chat and other islands.
- Future icon needs reuse the same `react-icons/si` pattern.
