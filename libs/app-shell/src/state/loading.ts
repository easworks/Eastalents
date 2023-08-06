import { Signal, computed, effect, signal } from '@angular/core';

export function generateLoadingState<T extends readonly string[]>() {
  type L = T[number];
  const set$ = signal(new Set<L>());
  const size$ = computed(() => set$().size);
  const any$ = computed(() => size$() > 0);

  const ops = {
    add: (value: L) => {
      set$.mutate(s => s.add(value));
    },
    delete: (value: L) => {
      set$.mutate(s => s.delete(value));
    },
    clear: () => {
      set$.mutate(s => s.clear());
    }
  } as const;

  return {
    ...ops,

    has: (value: L) => computed(() => set$().has(value)),
    react: (value: L, src: Signal<boolean>) => {
      effect(() => {
        if (src())
          ops.add(value);
        else
          ops.delete(value);
      }, { allowSignalWrites: true });
    },

    set$,
    size$,
    any$
  } as const;

}