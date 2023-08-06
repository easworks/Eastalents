import { createStore } from 'idb-keyval';
import { get, set } from 'idb-keyval';

export interface Cached<T> {
  id: string;
  timestamp: number;
  data: T;
}

export function isFresh(cached: Cached<unknown>, maxAgeMs: number) {
  return (Date.now() - cached.timestamp) <= maxAgeMs;
}

export function createCache(name: string) {
  const store = createStore(name, name);

  return {
    get: <T>(id: string) => {
      return get<Cached<T>>(id, store);
    },
    set: <T>(id: string, data: T) => {
      return set(id, { id, timestamp: Date.now(), data }, store);
    }
  } as const;
}
