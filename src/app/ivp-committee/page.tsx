import type { Metadata } from 'next';

import { FieldTest } from '@/components/features/field-test/FieldTest';

export const metadata: Metadata = {
  title: 'Field Test',
  description:
    'A short decision-making and memory challenge for SHPE NJIT IVP committee candidates.',
  robots: { index: false, follow: false },
};

export default function FieldTestPage() {
  return <FieldTest />;
}
