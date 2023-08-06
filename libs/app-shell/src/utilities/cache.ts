import { createStore } from 'idb-keyval';
import { get, set } from 'idb-keyval';

export interface Cached<T> {
  id: string;
  timestamp: number;
  data: T;
}

function isFresh(cached: Cached<unknown>, maxAgeMs: number) {
  return (Date.now() - cached.timestamp) <= maxAgeMs;
}

export function createCache(name: string) {
  const store = createStore(name, name);

  return {
    get: async <T>(id: string, maxAgeMs?: number) => {
      const cached = await get<Cached<T>>(id, store);
      if (cached && typeof maxAgeMs === 'number') {
        return isFresh(cached, maxAgeMs) ? cached.data : undefined;
      }
      return cached?.data;
    },
    set: <T>(id: string, data: T) => {
      return set(id, { id, timestamp: Date.now(), data }, store);
    }
  } as const;
}
