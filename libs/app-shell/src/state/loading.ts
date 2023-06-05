import { computed, signal } from '@angular/core';

export function generateLoadingState<T extends readonly string[]>() {
  type L = T[number];
  const set$ = signal(new Set<L>());
  const size$ = computed(() => set$().size);
  const any$ = computed(() => size$() > 0);

  return {
    add: (value: L) => {
      set$.mutate(s => s.add(value))
    },
    delete: (value: L) => {
      set$.mutate(s => s.delete(value))
    },
    clear: () => {
      set$.mutate(s => s.clear())
    },
    has: (value: L) => computed(() => set$().has(value)),

    set$,
    size$,
    any$
  } as const;

}