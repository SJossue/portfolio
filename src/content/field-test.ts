// Shared between the client assessment (FieldTest.tsx) and the submit API route —
// single source of truth for the choice copy and ids, so client and server never drift.

export interface Choice {
  id: string;
  title: string;
  body: string;
}

export const PATTERN_LENGTH = 5;
export const GRID_SIZE = 9;

export const DEPT_CHOICES: Choice[] = [
  {
    id: 'cold-email',
    title: 'Send the cold email today.',
    body: "Introduce SHPE, ask for 15 minutes. Fast, and you'd rather know where you stand than wait.",
  },
  {
    id: 'ask-chapter',
    title: 'Ask around the chapter first.',
    body: 'Somebody at SHPE probably knows somebody there. Find the warm path before you knock cold.',
  },
  {
    id: 'show-up',
    title: "Show up to something they're hosting.",
    body: 'Find an event that department is already running and introduce yourself in person first.',
  },
];

export const EARLY_CHOICES: Choice[] = [
  {
    id: 'jump-in',
    title: "Jump in on whoever's behind.",
    body: "The team finishes together or it doesn't really finish.",
  },
  {
    id: 'head-start',
    title: "Get a head start on what's next.",
    body: 'Use the time to move the next thing forward instead of waiting.',
  },
  {
    id: 'ask-split',
    title: "Ask if the work should've been split differently.",
    body: 'Flag it so next time the split is better, not just this time.',
  },
];

export function labelFor(choices: Choice[], id: string): string {
  return choices.find((c) => c.id === id)?.title ?? id;
}

export function isValidChoiceId(choices: Choice[], id: string): boolean {
  return choices.some((c) => c.id === id);
}
