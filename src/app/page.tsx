export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <div className="w-full max-w-3xl space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Jossue</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            A personal portfolio and engineering showcase built with Next.js, Tailwind, and
            TypeScript.
          </p>
        </header>

        <section className="border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <h2 className="mb-4 text-2xl font-semibold">Architecture Checks</h2>
          <ul className="list-inside list-disc space-y-2 text-neutral-600 dark:text-neutral-400">
            <li>App Router (`src/app`) routing enabled</li>
            <li>Tailwind CSS successfully configured</li>
            <li>Ready for modular `src/components/features`</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
