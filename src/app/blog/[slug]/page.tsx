import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from '@/components/features/blog/mdx-components';
import { getPost, getPostSlugs } from '@/lib/blog';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${post.title} — Jossue Sarango`,
      description: post.excerpt,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Blog
      </Link>

      <article className="mt-8">
        <header className="border-white/8 border-b pb-8">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/45">
            <time dateTime={post.date}>{format(parseISO(post.date), 'MMMM d, yyyy')}</time>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{post.title}</h1>
          {post.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-0.5 font-mono text-[10px]"
                  style={{ background: 'rgba(34, 211, 238, 0.12)', color: 'rgb(34, 211, 238)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <div className="mt-8">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight] },
            }}
          />
        </div>
      </article>
    </main>
  );
}
