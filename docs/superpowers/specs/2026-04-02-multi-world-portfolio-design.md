# Multi-World Portfolio — Design Spec

## Context

The current portfolio is a single-page app with two modes: a scroll-based 2D experience and a 3D garage scene. The user wants to transform it into a **multi-world experience** where 5 themed "worlds" each showcase a different dimension of their identity. The landing page becomes a hub that connects all worlds.

## Architecture

**Route-based worlds** using Next.js App Router:

| Route       | World    | Color              | Content                                     |
| ----------- | -------- | ------------------ | ------------------------------------------- |
| `/`         | Hub      | Multi-color        | Horizontal island carousel — world selector |
| `/garage`   | Garage   | `#f97316` (orange) | Projects & Tools                            |
| `/barber`   | Barber   | `#8b5cf6` (purple) | Work Experience & Professional Identity     |
| `/student`  | Student  | `#06b6d4` (cyan)   | Research & Education                        |
| `/real-me`  | Real Me  | `#10b981` (green)  | About, Contact & AI Chat                    |
| `/robotics` | Robotics | `#ef4444` (red)    | Technical Deep-Dives & Innovation           |

Each world is a separate route with its own page, assets, and metadata. Code-split per world.

## Hub Landing Page

### Layout

Full-viewport **horizontal island carousel**. Each island fills one viewport width. Users scroll/swipe left-to-right to browse worlds.

**Per-island viewport layout (3 columns):**

- **Left panel** (~15% width): World number (01/05), title with BlurText reveal, description, CountUp stat tags, "ENTER →" button
- **Center stage** (~70% width): Large floating 3D island platform with miniature scene elements. Island has colored underglow, depth edges, and responds to mouse with parallax tilt. Gently bobs with a sine-wave float animation
- **Right panel** (~15% width): "HIGHLIGHTS" label, 3 preview items (name + tech stack), subtle gradient divider lines, "+ N more inside →" teaser. Right-aligned, vertically centered to match left panel

**Fixed elements:**

- Top center: "JOSSUE SARANGO" name
- Bottom center: Horizontal pill nav dots (active = elongated + colored)
- Left edge: Previous arrow (dimmed on first island)
- Right edge: Next arrow (glows with next world's color)

### Island Scenes

Each island is a wide floating platform (~75% viewport width) with a miniature scene on top:

1. **Garage**: Car with headlights/taillights, workbench with tools, tool wall, tire stack, tall cabinet with shelves, neon ceiling light strips, smoke wisps
2. **Barber**: Barber chair, spinning pole, mirror wall, product shelves, checkered floor, warm ambient lighting
3. **Student**: Desk with laptop (glowing screen), stacked books, coffee cup, desk lamp, scattered papers, sticky notes
4. **Real Me**: Couch, photo frames on wall, plants, guitar, string lights, warm green glow
5. **Robotics**: Robot arm, circuit boards, LED matrix, 3D printer silhouette, monitors with code lines, red/blue LED pulses

### React Bits Integration

Install via copy-paste (TS-TW variant) into `src/components/ui/`:

| Component         | Usage                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Aurora**        | Full-screen background. Color shifts to match the active island's world color during scroll crossfade   |
| **Particles**     | Ambient firefly drift. Stream in scroll direction during transitions. Vortex convergence on world entry |
| **BlurText**      | World titles reveal as each island scrolls into view. Name reveal on initial load                       |
| **TextScramble**  | World subtitles and highlight text scramble on island arrival                                           |
| **SpotlightCard** | "ENTER →" button and island cards get cursor-following light beam                                       |
| **CountUp**       | Stat tags animate on island arrival (e.g., "8 Projects", "4yr Experience")                              |

### Interactions

**Horizontal scroll/swipe:**

- Mousewheel mapped to horizontal scroll via Lenis
- Touch swipe supported
- GSAP ScrollTrigger snap points — each snap = 1 viewport width
- Keyboard: arrow keys (← →) navigate, Enter enters world, Escape returns to hub

**Between islands (transition ~600ms):**

- Current island slides out left (shrinks + fades)
- Next island slides in from right (grows + brightens)
- Aurora crossfades between world colors
- Particles stream in scroll direction
- BlurText re-triggers on new island title

**Enter a world:**

- Click "ENTER →" or click the island itself
- Island zooms to fill entire screen
- Color wash covers viewport
- GSAP page transition (~800ms) morphs into the world page route
- Page navigation via Next.js router

**Load sequence:**

1. Aurora fades in from black
2. BlurText reveals "JOSSUE SARANGO" at top
3. First island (Garage) materializes with scene elements
4. Particles begin drifting
5. Left/right text fades in
6. Nav dots appear

### Mobile Layout

- Vertical scroll instead of horizontal (natural mobile gesture)
- Islands stack vertically, each fills viewport height
- Left/right text panels move to above/below the island
- Touch swipe with snap points
- Side arrows hidden, bottom dots remain

## World Pages

Each world page (`/garage`, `/barber`, etc.) follows a shared structure:

### Shared Infrastructure

- `WorldLayout` — common shell wrapping all world pages. Provides:
  - **WorldNav** — top bar with world-switcher (colored dots to jump between worlds) + "← Hub" return button
  - Signature color theming via CSS variables
  - Entry/exit transition wrapper
  - Mobile responsive container

### World Page Structure (per world)

Each world page has two modes (like the current garage):

1. **3D immersive mode** — R3F scene specific to that world's theme (the existing garage pattern, extended to new worlds). Interactive hitboxes for section content. Camera rig, lighting, and postprocessing per world
2. **Scroll fallback** — 2D scroll-based content sections for that world's content, with GSAP ScrollReveal animations. For devices without WebGL or users who prefer 2D

### Content Mapping

| World    | Content Sources                                            | Existing Files                          |
| -------- | ---------------------------------------------------------- | --------------------------------------- |
| Garage   | `projects.ts`, tools (from about.ts skill groups)          | Existing 3D scene + panels              |
| Barber   | `experience.ts`                                            | ExperienceSection, ExperiencePanel      |
| Student  | `research.ts`                                              | ResearchSection, ResearchPanel          |
| Real Me  | `about.ts`, `contact.ts`, AI chat                          | AboutSection, ContactSection, ChatPanel |
| Robotics | Subset of `projects.ts` (technical), new deep-dive content | ProjectsSection (filtered)              |

## File Structure

```
src/app/
├── page.tsx                         ← Hub (horizontal island carousel)
├── layout.tsx                       ← Root layout (unchanged)
├── garage/page.tsx                  ← Garage world
├── barber/page.tsx                  ← Barber world
├── student/page.tsx                 ← Student world
├── real-me/page.tsx                 ← Real Me world
└── robotics/page.tsx                ← Robotics world

src/components/features/
├── hub/
│   ├── HubCarousel.tsx              ← Horizontal scroll container + snap logic
│   ├── IslandViewport.tsx           ← Single island viewport (left text + island + right text)
│   ├── IslandScene.tsx              ← 2D island platform with miniature scene (CSS/SVG)
│   ├── HubNav.tsx                   ← Bottom dots + side arrows
│   └── WorldTransition.tsx          ← GSAP enter-world transition
├── worlds/
│   ├── shared/
│   │   ├── WorldLayout.tsx          ← Common world shell
│   │   ├── WorldNav.tsx             ← Top nav with world-switcher
│   │   └── WorldTheme.tsx           ← CSS variable provider per world color
│   ├── garage/                      ← Refactored from current scene/
│   ├── barber/
│   ├── student/
│   ├── real-me/
│   └── robotics/
└── ui/
    ├── Aurora.tsx                    ← From react-bits
    ├── Particles.tsx                 ← From react-bits
    ├── BlurText.tsx                  ← From react-bits
    ├── TextScramble.tsx              ← From react-bits
    ├── SpotlightCard.tsx             ← From react-bits
    └── CountUp.tsx                   ← From react-bits
```

## Performance Constraints

Per `docs/PROJECT.md`:

- LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms
- Initial JS bundle ≤ 200 KB gzipped
- 3D models ≤ 2 MB each
- Hub page should NOT load WebGL/R3F — islands are CSS/SVG-based 2D representations
- Each world route lazy-loads its own 3D assets only when visited
- React-bits components are copy-pasted (no external dependency), tree-shaken

## Accessibility

- Keyboard navigation throughout (arrow keys, Enter, Escape)
- `prefers-reduced-motion`: disable floating/parallax, use instant transitions
- Screen reader announcements for island changes (SectionAnnouncer pattern)
- Skip link to jump past carousel to first world
- Semantic landmarks per world page
- Visible focus states on all interactive elements

## Build Order

1. **Phase 1 — Hub**: Horizontal island carousel with all 5 islands (CSS/SVG scenes), react-bits effects, navigation, transitions, mobile layout
2. **Phase 2 — Shared World Infrastructure**: WorldLayout, WorldNav, WorldTheme, transition system, route setup
3. **Phase 3 — Garage World**: Refactor existing 3D scene into `/garage` route using shared infrastructure
4. **Phase 4 — Barber World**: New 3D scene + panels for work experience
5. **Phase 5 — Student World**: New 3D scene + panels for research/education
6. **Phase 6 — Real Me World**: New 3D scene + panels for about/contact/chat
7. **Phase 7 — Robotics World**: New 3D scene + panels for technical deep-dives

Each phase is independently deployable. The hub works immediately with placeholder "coming soon" states for unbuilt worlds.

## Verification

- `npm run typecheck` — no type errors
- `npm run lint` — no lint warnings
- `npm run build` — successful production build
- `npm run test` — all tests pass
- Manual: horizontal scroll snaps correctly on desktop and mobile
- Manual: each world route loads independently via direct URL
- Manual: "ENTER →" triggers transition and navigates to world page
- Manual: WorldNav allows jumping between worlds
- Manual: keyboard navigation works (arrows, Enter, Escape)
- Manual: reduced-motion preference disables animations
- Lighthouse: LCP ≤ 2.5s on hub page (no WebGL loaded)
