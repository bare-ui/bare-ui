import { resolve } from 'node:path';

// Server markup produced by the SSR phase (`vitest.ssr.config.ts`) and consumed
// by the hydration phase (`vitest.hydrate.config.ts`). The two phases run as
// separate processes (node vs jsdom) and cannot share runtime memory, so the
// fixture file is the hand-off. Lives in a gitignored `.test-fixtures/` dir at
// the package root; resolved from cwd (the package root under both `npm run` and
// a direct `vitest --config`) so it works in node and jsdom alike.
export const FIXTURES_PATH = resolve(process.cwd(), '.test-fixtures/ssr-hydration.json');

export type HydrationFixtures = Record<string, string>;
