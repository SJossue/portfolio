import { Container } from '@/components/ui/container';

export default function HomePage() {
  return (
    <main className="py-16 lg:py-24">
      <Container>
        <header className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Portfolio Foundation
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Ship fast, accessible experiences with a structure designed for multiple coding agents.
          </h1>
          <p className="max-w-2xl text-lg text-slate-700">
            This starter intentionally focuses on architecture, quality gates, and contribution
            workflows so the portfolio can evolve safely.
          </p>
        </header>

        <section
          aria-labelledby="baseline"
          className="mt-12 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2 id="baseline" className="text-xl font-semibold">
            Baseline included
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-800">
            <li>Strict TypeScript + Next.js App Router</li>
            <li>ESLint, Prettier, import sorting, and Husky hooks</li>
            <li>Vitest unit testing + Playwright e2e scaffolding</li>
            <li>CI pipeline for lint, typecheck, tests, and build</li>
          </ul>
        </section>
      </Container>
    </main>
  );
}
