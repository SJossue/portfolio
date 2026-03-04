import { HomeScene } from '@/components/features/scene/HomeScene';

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-full rounded-md bg-cyan-500 px-4 py-2 font-mono text-sm text-black transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <main id="main-content" className="min-h-screen w-full">
        <HomeScene />
      </main>
    </>
  );
}
