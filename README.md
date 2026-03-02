# Portfolio Foundation

Production-grade, agent-friendly foundation for a personal portfolio app built with Next.js App Router + TypeScript.

## Quickstart

### Prereqs

- Node.js (use `.nvmrc` - currently `22`)
- npm

### Install

```bash
nvm use
npm install
npm run prepare
npx playwright install --with-deps chromium
```

### Run dev

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Quality checks

Run everything:

```bash
npm run validate
```

Or individually:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run e2e
npm run build
```

## Scripts

- `dev`: start dev server
- `build`: production build
- `start`: serve production build
- `lint`: ESLint
- `typecheck`: TypeScript checks
- `test`: unit tests (Vitest)
- `e2e`: Playwright tests
- `format`: Prettier check
- `format:write`: apply Prettier
- `validate`: lint + typecheck + tests + build

## Docs

- `PROJECT.md`: product vision, UX + perf principles, definition of done
- `CONTRIBUTING.md`: how to contribute + review standards
- `docs/AGENTS.md`: operating manual for coding agents
- `docs/ARCHITECTURE.md`: architecture and boundaries
- `docs/WORKFLOWS.md`: playbooks for common tasks
- `docs/adr/`: architecture decision records
- `docs/ADRS.md`: ADR index
