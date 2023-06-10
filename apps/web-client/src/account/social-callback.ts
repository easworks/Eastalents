import { Inject, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivateFn } from '@angular/router';
import { AccountApi, AuthService, AuthState } from '@easworks/app-shell';
import { SocialCallbackState, SocialSignInRequest, SocialSignUpRequest } from '@easworks/models';
import { firstValueFrom } from 'rxjs';

export const socialCallbackGuard: CanActivateFn = async (route) => {
  const csrf = route.queryParamMap.get('state');
  if (!csrf)
    throw new Error(`'state' query parameter was expected but not found`);

  const code = route.queryParamMap.get('code');
  if (!code)
    throw new Error(`'code' query parameter was expected but not found`);

  const auth = inject(AuthService);

  const state = auth.socialCallback.get();

  if (!state || state.request.code !== csrf)
    throw new Error('error during social login');

  state.request.code = code;

  const result = await firstValueFrom(inject(AccountApi)
    .socialLogin(state.request))
  //   .signIn.social({ provider: state.provider, code });

  // if ('token' in result) {
  //   // const auth = inject(AuthService);
  //   // auth.handleSignIn(result.token, state[RETURN_URL_KEY]);
  //   return false;
  // }
  // else {
  //   inject(AuthState).partialSocialSignIn$.set({
  //     provider: state.provider,
  //     ...result
  //   });
  //   const dialog = inject(MatDialog);

  //   const comp = await import('./social-callback.dialog')
  //     .then(m => m.SociallCallbackDialogComponent);


  //   const dialogRef = dialog.open(comp, {
  //     closeOnNavigation: true,
  //     disableClose: true
  //   });

  //   await firstValueFrom(dialogRef.afterClosed())

  return true;
}
