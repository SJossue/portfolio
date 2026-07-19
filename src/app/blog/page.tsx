import type { Metadata } from 'next';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes from Jossue Sarango on building across hardware, software, and applied AI — process, teardowns, and lessons from the workshop.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Jossue Sarango',
    description: 'Notes on building across hardware, software, and applied AI.',
    url: '/blog',
  },
};

const eyebrow = 'font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45';

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Hub
      </Link>

      <header className="mt-8">
        <p className={eyebrow}>Writing</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">The Blog</h1>
        <p className="mt-3 max-w-prose text-white/60">
          Notes from the workshop — building across hardware, software, and applied AI.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-white/50">No posts yet — check back soon.</p>
      ) : (
        <ul className="mt-12 space-y-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="glass-card block rounded-2xl p-6 transition-colors"
              >
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/45">
                  <time dateTime={post.date}>{format(parseISO(post.date), 'MMM d, yyyy')}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-white">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{post.excerpt}</p>
                {post.tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md px-2 py-0.5 font-mono text-[10px]"
                        style={{
                          background: 'rgba(34, 211, 238, 0.12)',
                          color: 'rgb(34, 211, 238)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
