import { Injector, Signal, effect } from '@angular/core';

export function toPromise<T>(source: Signal<T>, predicate: (value: T) => boolean, injector?: Injector) {
  return new Promise<T>((resolve) => {
    // if current value satisfies condition, resolve immeditely
    const current = source();
    if (predicate(current)) {
      resolve(current);
      return;
    }
    // else watch future value emissions
    else {
      const eff = effect(() => {
        const current = source();
        if (predicate(current)) {
          resolve(current);
          eff.destroy(); // should this go before resolve?
        }
      }, { injector });
    }
  });
}

