import { computed, signal } from '@angular/core';

export function generateLoadingState<T extends readonly string[]>(states: T) {
  const set$ = signal(new Set<T[number]>());
  const size$ = computed(() => set$().size);
  const any$ = computed(() => size$() > 0);

  return {
    add: (value: T[number]) => {
      set$.mutate(s => s.add(value))
    },
    delete: (value: T[number]) => {
      set$.mutate(s => s.delete(value))
    },
    clear: () => {
      set$.mutate(s => s.clear())
    },

    set$,
    size$,
    any$
  } as const;

}