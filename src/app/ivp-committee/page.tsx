import type { Metadata } from 'next';

import { FieldTest } from '@/components/features/field-test/FieldTest';

export const metadata: Metadata = {
  title: 'IVP Committee Screening',
  description:
    'A short decision-making and memory challenge for SHPE NJIT IVP committee candidates.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'IVP Committee Screening — SHPE NJIT',
    description:
      'A short decision-making and memory challenge for SHPE NJIT IVP committee candidates.',
  },
};

export default function FieldTestPage() {
  return <FieldTest />;
}
