import { WritableSignal } from '@angular/core';

export function forceEmit<T>(signal$: WritableSignal<T>) {
  const current = signal$();
  signal$.set(null as unknown as T);
  signal$.set(current);
}
