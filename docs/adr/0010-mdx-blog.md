# ADR 0010: MDX Blog

**Status**: Accepted
**Date**: 2026-07-18
**Deciders**: Project owner

## Context

The site needed a blog for long-form writing (build logs, teardowns, notes).
Posts want rich authoring — headings, lists, tables, and syntax-highlighted code
— beyond what the typed content files (`projects.ts`, `research.ts`) express, and
beyond the lightweight in-app markdown renderer used by the chat.

## Decision

Author posts as **`.mdx` files** in `src/content/blog/` with YAML frontmatter,
rendered at build time. Pipeline:

- **`gray-matter`** — parse frontmatter (title, date, excerpt, tags, cover).
- **`next-mdx-remote/rsc`** — render the MDX body inside a React Server Component
  (no client bundle for post content).
- **`remark-gfm`** — GitHub-flavored markdown (tables, strikethrough, autolinks).
- **`rehype-highlight`** + **`highlight.js`** — build-time syntax highlighting;
  the `github-dark` theme is imported only in the blog `layout.tsx`, and
  `.hljs`'s own background is stripped in `globals.css` so our styled `<pre>`
  shows through.

`src/lib/blog.ts` reads the directory with `fs` (server-only). Routes:
`/blog` (index) and `/blog/[slug]` (post, `generateStaticParams` +
`dynamicParams = false` so unknown slugs 404). Element styling is a custom
`mdxComponents` map — no typography plugin — to keep posts in the site's voice.

## Rationale

- **RSC rendering**: post bodies add nothing to the client JS bundle.
- **Build-time**: highlighting and MDX compile happen at build; pages are static.
- **Familiar authoring**: plain `.mdx` files in the repo, versioned with the code.
- **No global config coupling**: unlike `@next/mdx`, `next-mdx-remote` keeps MDX
  scoped to the blog instead of turning `.mdx` into routable pages app-wide.

### Alternatives Considered

| Alternative                    | Why Not                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| Typed data file (`blog.ts`)    | No rich formatting / code highlighting; awkward for long prose   |
| `@next/mdx`                    | Couples MDX to global route config; clumsier frontmatter/listing |
| Reuse in-app markdown renderer | No code highlighting, tables, or MDX components                  |
| `rehype-pretty-code` (shiki)   | Heavier; `rehype-highlight` covers the need at lower cost        |

## Consequences

- New deps: `next-mdx-remote`, `gray-matter`, `remark-gfm`, `rehype-highlight`,
  `highlight.js`.
- Posts live in `src/content/blog/*.mdx`; add a file → it appears on `/blog` and
  in the sitemap automatically.
- `/blog` is linked from the hub left rail; the sitemap lists the index + posts.
- The highlight.js theme loads only on blog routes; the `.hljs` background reset
  in `globals.css` is global but inert elsewhere.
