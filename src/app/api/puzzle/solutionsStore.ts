import crypto from 'crypto';

// Use globalThis to persist the store across hot module reloads in development
const globalForStore = globalThis as unknown as {
  solutionsStore: Map<string, number[][]> | undefined;
};

const store = globalForStore.solutionsStore ?? new Map<string, number[][]>();
globalForStore.solutionsStore = store;

export function saveSolution(solution: number[][]) {
  let id: string;
  try {
    // Prefer secure UUID when available
    // @ts-ignore
    id = (crypto && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  } catch {
    id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  }
  store.set(id, solution);
  return id;
}

export function getSolution(id: string) {
  return store.get(id) ?? null;
}

export function deleteSolution(id: string) {
  return store.delete(id);
}
