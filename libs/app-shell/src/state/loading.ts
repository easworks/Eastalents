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

  const has = (() => {
    const has = (value: L) => computed(() => set$().has(value));

    return Object.assign(has, {
      any: (...value: L[]) => computed(() => {
        const set = set$();
        return value.some(v => set.has(v));
      }),
      all: (...value: L[]) => computed(() => {
        const set = set$();
        return value.every(v => set.has(v));
      })
    });


  })();

  return {
    ...ops,

    has,
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