import { BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ImmutableSet } from './immutable-set';

export class LoadingState<T extends string> extends BehaviorSubject<Set<T>> {
  add(value: T) {
    const r = ImmutableSet.add(this.value, value);
    this.next(r);
    return r;
  }

  delete(value: T) {
    const r = ImmutableSet.delete(this.value, value);
    this.next(r);
    return r;
  }

  has$(value: T) {
    return this.pipe(
      map(v => v.has(value)),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  size$() {
    return this.pipe(
      map(v => v.size),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

}