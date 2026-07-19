import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

/**
 * Filesystem-backed blog. Posts are `.mdx` files with YAML frontmatter in
 * `src/content/blog/`. These helpers use `fs`, so they must only be called from
 * server components / build-time code (pages, sitemap, metadata) — never a
 * client component.
 */

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export interface PostMeta {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  cover?: string;
}

export interface Post extends PostMeta {
  /** Raw MDX body (frontmatter stripped). */
  content: string;
}

function coerceDate(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return '';
}

function parse(slug: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8');
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: String(data.title ?? slug),
    date: coerceDate(data.date),
    excerpt: String(data.excerpt ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    content,
  };
}

/** All post slugs (filenames without the `.mdx` extension). */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

/** Post metadata for the index, newest first (body omitted). */
export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map(parse)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta);
}

/** A single post with its MDX body, or null if the slug doesn't exist. */
export function getPost(slug: string): Post | null {
  try {
    return parse(slug);
  } catch {
    return null;
  }
}
