import { Signal, computed, effect, signal } from '@angular/core';

export function generateLoadingState<T extends readonly string[]>() {
  type L = T[number];
  const set$ = signal(new Set<L>(), { equal: () => false });
  const size$ = computed(() => set$().size);
  const any$ = computed(() => size$() > 0);

  const ops = {
    add: (value: L) => {
      set$.update(s => {
        s.add(value);
        return s;
      });
    },
    delete: (value: L) => {
      set$.update(s => {
        s.delete(value);
        return s;
      });
    },
    clear: () => {
      set$.update(s => {
        s.clear();
        return s;
      });
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