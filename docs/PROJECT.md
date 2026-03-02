# Project Overview

## Vision

A high-performance portfolio showcasing 3D interactive experiences with cinematic motion, built with Next.js and React Three Fiber (R3F). The site demonstrates technical capability while maintaining exceptional performance and accessibility standards.

## Performance Budgets

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: ≤ 2.5s (p75)
- **CLS (Cumulative Layout Shift)**: ≤ 0.1 (p75)
- **INP (Interaction to Next Paint)**: ≤ 200ms (p75)
- **FCP (First Contentful Paint)**: ≤ 1.8s (p75)
- **TTFB (Time to First Byte)**: ≤ 600ms (p75)

### Bundle Size Limits

- **Initial JS bundle**: ≤ 200 KB (gzipped)
- **Total page weight (first load)**: ≤ 500 KB (gzipped)
- **Individual route chunks**: ≤ 50 KB (gzipped)
- **Third-party scripts**: Minimize; async/defer required

### 3D Asset Budgets

- **GLB/GLTF file size**: ≤ 2 MB per model (compressed)
- **Texture resolution**: Max 2048×2048 for hero assets, 1024×1024 for secondary
- **Triangle count**: ≤ 100k triangles per scene on mobile, ≤ 250k on desktop
- **Draw calls**: ≤ 50 per frame
- **Shader complexity**: Keep fragment shaders under 100 instructions where possible

### Loading Strategy

- **Above-the-fold content**: Prioritize, no 3D blocking
- **3D canvas initialization**: Lazy-loaded after critical content
- **Model streaming**: Use Suspense + progressive loading with LOD fallbacks
- **Texture loading**: Lazy + basis/ktx2 compression for supported browsers

## UX Non-Negotiables

These requirements apply to ALL features. Violating any of these makes a PR incomplete:

1. **Intro must be skippable**
   - "Skip Intro" button visible and accessible
   - Keyboard shortcut available (e.g., Escape key)
   - Preference remembered in localStorage

2. **Must respect `prefers-reduced-motion`**
   - Detect system preference
   - Provide manual toggle in settings
   - Fallback to static/simplified animations when enabled
   - No parallax, autoplay videos, or spinning elements in reduced motion mode

3. **Must have fallback for low-power devices**
   - Detect GPU capability (via WebGL extensions or feature detection)
   - Static hero image or simplified route for unsupported browsers
   - Graceful degradation message if WebGL 2 unavailable
   - No hard errors or blank screens

## Accessibility Requirements

- **Keyboard navigation**: Full support, visible focus indicators
- **Screen readers**: Semantic HTML, ARIA labels where needed
- **Motion preferences**: Respect `prefers-reduced-motion`, offer toggle
- **Color contrast**: WCAG AA minimum (4.5:1 for text)
- **Skip links**: "Skip to content" and "Skip intro" for 3D experiences

## Browser Support

- **Modern evergreen**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile**: iOS Safari 15+, Chrome Android 100+
- **Graceful degradation**: Static fallback for browsers without WebGL 2

## Technology Constraints

### Required

- Next.js 15+ (App Router)
- React 19+
- TypeScript (strict mode)
- Tailwind CSS

### 3D Stack (when added)

- React Three Fiber (R3F)
- Drei (helpers only, avoid bloat)
- GSAP (animation orchestration)
- Zustand (3D state management)

### Forbidden Without ADR

- CSS-in-JS runtime libraries (Emotion, Styled Components)
- Large animation libraries (Framer Motion for 3D - use GSAP)
- Heavyweight UI frameworks (MUI, Chakra)
- Unoptimized image formats (always use Next.js Image + WebP/AVIF)

## 3D Budgets (Detailed)

### Final Production Targets

- **Total scene GLB**: ≤ 10 MB (stretch goal: ≤ 5 MB)
- **Car model triangle count**: ≤ 300k (stretch goal: ≤ 200k)
- **Entire scene triangle count**: ≤ 500k triangles
- **Postprocessing**: Avoid heavy effects by default; enable only if 60fps stable

### Optimization Requirements

- Use **Draco compression** for GLB files
- Use **KTX2 textures** with Basis Universal compression for supported browsers
- Implement **LOD (Level of Detail)** for models viewed at distance
- Lazy-load non-critical 3D assets with React Suspense

## Development Principles

1. **Ship incrementally**: UI shell → placeholder 3D → real assets
2. **Measure continuously**: Lighthouse CI on every PR
3. **Optimize eagerly**: Bundle analysis, tree-shaking, code splitting
4. **Test accessibly**: Automated a11y checks in CI
5. **Document decisions**: ADR for any architectural change

## Build Discipline

### Dependency Management

- **No new dependencies without:**
  1. Clear justification in PR description
  2. ADR entry for long-term impact decisions (`docs/adr/`)
  3. Bundle size impact analysis (use `npx bundlephobia <package>`)
- **Avoid architecture churn**: Keep feature work incremental, no large refactors
- **Prefer native/existing solutions** before adding libraries

### Code Quality Standards

- **No dead code or commented-out blocks**
- **No console.log in production** (use proper logging if needed)
- **Follow existing patterns** - don't introduce new styles without discussion
- **Keep PRs focused** - one feature/fix per PR, < 500 lines changed

## Monitoring & Validation

- **CI gates**: lint, typecheck, test, build, e2e (Playwright)
- **Preview deployments**: Every PR gets Vercel preview URL
- **Lighthouse CI** (future): Fail PRs that regress Core Web Vitals
- **Bundle analysis** (future): Automated size tracking

## Risk Mitigation

- **Performance regression**: Lighthouse CI + manual checks on preview
- **Accessibility regression**: axe-core in Playwright tests
- **3D complexity creep**: Hard triangle/texture budgets enforced in ADRs
- **Bundle bloat**: Import cost plugin + manual review of dependencies

---

**Last updated**: 2026-03-01
**Owner**: Engineering
**Review cadence**: Every major feature addition or architecture change
