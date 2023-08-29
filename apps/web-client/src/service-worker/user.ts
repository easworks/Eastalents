import { UserWithToken } from '@easworks/models';
import { BehaviorSubject } from 'rxjs';

declare const self: ServiceWorkerGlobalScope;

export const user$ = new BehaviorSubject<UserWithToken | null>(null);

export function setupUserContext() {
  self.addEventListener('message', ({ data, ports }) => {
    if (data.type === 'USER CHANGE') {
      const user: UserWithToken | null = data.payload.user;
      const state = user$.value;
      if (state?.token !== user?.token)
        user$.next(user);
      ports[0].postMessage(undefined);
    }
  });
}
