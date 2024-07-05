import { InjectionToken, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authFeature } from '../state/auth';
import { toPromise } from '../utilities/to-promise';

// This needs to be in a separate file 
// otherwise it results in unpredicatable errors
// related to circular dependency of the backend apis 
// 'Uncaught: Class extends value undefined is not a function or null'
export const AUTH_READY = new InjectionToken<Promise<boolean>>('AUTH_READY', {
  factory: () => {
    const store = inject(Store);
    const ready = toPromise(store.selectSignal(authFeature.selectReady), v => v);
    return ready;
  }
});