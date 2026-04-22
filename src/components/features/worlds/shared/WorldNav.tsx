'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { worlds } from '@/content/worlds';

interface WorldNavProps {
  worldId: string;
}

export default function WorldNav({ worldId }: WorldNavProps) {
  const router = useRouter();
  const world = worlds.find((w) => w.id === worldId);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#030318]/60 px-5 py-3 backdrop-blur-md">
      <Link
        href="/"
        className="text-sm font-medium tracking-wide text-slate-300 transition-colors hover:text-white"
      >
        &larr; Hub
      </Link>

      <span className="text-sm font-bold tracking-wider" style={{ color: world?.color }}>
        {world?.name}
      </span>

      <div className="flex items-center gap-2">
        {worlds.map((w) => (
          <button
            key={w.id}
            aria-label={`Go to ${w.name}`}
            onClick={() => router.push(w.slug)}
            className={`rounded-full transition-all ${
              w.id === worldId ? 'h-3 w-3' : 'h-2 w-2 opacity-50 hover:opacity-80'
            }`}
            style={{ backgroundColor: w.color }}
          />
        ))}
      </div>
    </nav>
  );
}
