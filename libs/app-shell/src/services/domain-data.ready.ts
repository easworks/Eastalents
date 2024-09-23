import { inject, InjectionToken } from '@angular/core';
import { Store } from '@ngrx/store';
import { domainData } from '../state/domain-data';
import { toPromise } from '../utilities/to-promise';

export const DOMAIN_DATA_READY = new InjectionToken<Promise<boolean>>('DOMAIN_DATA_READY', {
  factory: () => {
    const store = inject(Store);
    const ready = toPromise(store.selectSignal(domainData.feature.selectReady), v => v);
    return ready;
  }
});
