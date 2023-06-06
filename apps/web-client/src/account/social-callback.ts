import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivateFn } from '@angular/router';
import { AccountApi, AuthState } from '@easworks/app-shell';
import { SocialCallbackState } from '@easworks/models';
import { firstValueFrom } from 'rxjs';

export const socialCallbackGuard: CanActivateFn = async (route) => {
  const stateString = route.queryParamMap.get('state');
  if (!stateString)
    throw new Error(`'state' query parameter was expected but not found`);
  const state = JSON.parse(stateString) as SocialCallbackState;

  const code = route.queryParamMap.get('code');
  if (!code)
    throw new Error(`'code' query parameter was expected but not found`);

  const result = inject(AccountApi)
    .signIn.social({ provider: state.provider, code });

  if ('token' in result) {
    // const auth = inject(AuthService);
    // auth.handleSignIn(result.token, state[RETURN_URL_KEY]);
    return false;
  }
  else {
    inject(AuthState).partialSocialSignIn$.set({
      provider: state.provider,
      ...result
    });
    const dialog = inject(MatDialog);

    const comp = await import('./social-callback.dialog')
      .then(m => m.SociallCallbackDialogComponent);


    const dialogRef = dialog.open(comp, {
      closeOnNavigation: true,
      disableClose: true
    });

    await firstValueFrom(dialogRef.afterClosed())

    return true;
  }

}
