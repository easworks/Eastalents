import { signal } from '@angular/core';
import { UserWithToken } from '@easworks/models';

declare const self: ServiceWorkerGlobalScope;

export const user$ = signal<UserWithToken | null>(null);

export function setupUserContext() {
  self.addEventListener('message', ({ data, ports }) => {
    if (data.type === 'USER CHANGE') {
      const user: UserWithToken | null = data.payload.user;
      user$.update(state =>
        user?.token === state?.token ?
          state : user);
      ports[0].postMessage(undefined);
    }
  });
}
