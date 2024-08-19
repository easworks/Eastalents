import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanActivateFn } from '@angular/router';
import { OAuthApi } from '@easworks/app-shell/api/oauth.api';
import { map } from 'rxjs';

export const oauthAuthorizeCallback: CanActivateFn = (snap) => {
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

export function extractClientIdFromReturnUrl(returnUrl: string | null) {
  if (returnUrl && returnUrl.startsWith('/oauth/authorize?')) {
    const url = new URL(window.location.origin + returnUrl);
    return url.searchParams.get('client_id');
  }
  return null;
}