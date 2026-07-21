import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from '@/components/features/blog/mdx-components';
import StudentWorld from '@/components/features/worlds/student/StudentWorld';
import { researchData } from '@/content/research';

export const metadata: Metadata = {
  title: 'The Student',
  description: 'Research, education, and the academic journey.',
  alternates: { canonical: '/student' },
  openGraph: {
    title: 'The Student — Jossue Sarango',
    description: 'Research, education, and the academic journey.',
    url: '/student',
  },
};

export default function StudentPage() {
  // Pre-render each paper's markdown body on the server (MDX must render in a
  // server component); the client world just swaps the finished nodes into view.
  const renderedPapers: Record<string, ReactNode> = Object.fromEntries(
    researchData.map((paper) => [
      paper.id,
      <MDXRemote
        key={paper.id}
        source={paper.body}
        components={mdxComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />,
    ]),
  );

  return <StudentWorld renderedPapers={renderedPapers} />;
}
