import crypto from 'crypto';

// Use globalThis to persist the store across hot module reloads in development
const globalForStore = globalThis as unknown as {
  solutionsStore: Map<string, number[][]> | undefined;
};

const store = globalForStore.solutionsStore ?? new Map<string, number[][]>();
globalForStore.solutionsStore = store;

export function saveSolution(solution: number[][]) {
  const id = crypto.randomUUID();
  store.set(id, solution);
  return id;
}

export function getSolution(id: string) {
  return store.get(id) ?? null;
}
