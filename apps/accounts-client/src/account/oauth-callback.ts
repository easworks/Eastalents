import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanActivateFn } from '@angular/router';
import { OAuthApi } from '@easworks/app-shell/api/oauth.api';
import { map } from 'rxjs';

export const oauthCallback: CanActivateFn = (snap) => {
  const api = inject(OAuthApi);

  return api.generateCode(snap.queryParams)
    .pipe(
      map(result => {
        location.href = result;
        return false;
      }),
      takeUntilDestroyed()
    );
};