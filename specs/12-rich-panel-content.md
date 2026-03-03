# Feature: Rich Panel Content

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

---

## Overview

Replace the single-sentence placeholder content in OverlayPanel with rich, structured content for each section: project showcase cards, about/skills section, and contact links.

**User story**: As a visitor, I want to see detailed portfolio content (projects, skills, contact info) when I click on garage interactables so that I can learn about the engineer's work and get in touch.

## Requirements

### Functional Requirements

1. The system MUST display a list of project cards in the Projects panel with title, description, tech stack tags, and external links (GitHub/live demo).
2. The system MUST display a bio paragraph, skills grid, and experience highlights in the About panel.
3. The system MUST display contact links (GitHub, LinkedIn, email) in the Contact panel.
4. Content MUST be sourced from a centralized `src/content/` data layer (plain TypeScript objects — no CMS).
5. All links MUST open in new tabs with `rel="noopener noreferrer"`.

### Non-Functional Requirements

- **Accessibility**: Links must have descriptive aria-labels. Cards must be keyboard-navigable.
- **Performance**: No new dependencies. Pure HTML/CSS with Tailwind.
- **Mobile**: Content must scroll within the panel on small screens.

## Technical Approach

### New Files

| File                                                     | Purpose                      |
| -------------------------------------------------------- | ---------------------------- |
| `src/content/projects.ts`                                | Project data array           |
| `src/content/about.ts`                                   | Bio, skills, experience data |
| `src/content/contact.ts`                                 | Contact links data           |
| `src/content/index.ts`                                   | Barrel export                |
| `src/components/features/scene/panels/ProjectsPanel.tsx` | Projects section renderer    |
| `src/components/features/scene/panels/AboutPanel.tsx`    | About section renderer       |
| `src/components/features/scene/panels/ContactPanel.tsx`  | Contact section renderer     |
| `src/components/features/scene/panels/index.ts`          | Barrel export                |

### Modified Files

| File               | Change                                                                         |
| ------------------ | ------------------------------------------------------------------------------ |
| `OverlayPanel.tsx` | Import panel components, render based on `section` prop instead of static text |

### Content Structure

```typescript
// projects.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

// about.ts
export interface AboutData {
  bio: string;
  skills: { category: string; items: string[] }[];
  highlights: { label: string; value: string }[];
}

// contact.ts
export interface ContactLink {
  id: string;
  label: string;
  href: string;
  icon: string; // emoji or text icon
}
```

### Styling

- Cyberpunk theme: dark cards (`bg-white/5`), neon borders on hover (`border-cyan-400/50`), cyan/magenta accent text
- Project tech tags: small pills with `bg-cyan-500/10 text-cyan-400` styling
- Scrollable content area within fixed panel height
- Subtle hover transitions on cards and links

## Acceptance Criteria

- [ ] Projects panel shows 3-4 project cards with title, description, tech stack, and links
- [ ] About panel shows bio, skills grid, and highlights
- [ ] Contact panel shows clickable links that open in new tabs
- [ ] All content is sourced from `src/content/` (easy to customize)
- [ ] Panel scrolls when content overflows
- [ ] Keyboard navigation works (Tab through cards/links)
- [ ] `npm run validate` passes

## Testing Strategy

- **Unit tests**: OverlayPanel test updated to verify section-specific content renders
- **E2E**: Existing "clicking Projects in HUD opens overlay panel" test still passes

## Out of Scope

- CMS integration
- Dynamic content loading
- Image/screenshot support for projects
- Contact form
