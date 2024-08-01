import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthService } from '@easworks/app-shell/services/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { RETURN_URL_KEY } from 'models/auth';
import { finalize, map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'oauth-page',
  templateUrl: './oauth.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class OAuthPageComponent {
  constructor() {
    this.signInOtherApp();
  }

  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  @HostBinding() private readonly class = 'page grid place-content-center';

  protected readonly loading = generateLoadingState<[
    'getting code'
  ]>();

  private signInOtherApp() {
    this.loading.add('getting code');

    this.route.queryParamMap
      .pipe(
        map(params => {
          const code = params.get('code');
          if (!code)
            throw new Error('code should not be null');
          const stateB64 = params.get('state');
          let returnUrl: string | undefined;
          if (stateB64) {
            try {
              const state = JSON.parse(btoa(stateB64));
              returnUrl = state[RETURN_URL_KEY];
            }
            catch (err) { /* empty */ }
          }

          return { code, returnUrl };
        }),
        switchMap(params => this.auth.signIn.oauthCode(params.code, params.returnUrl)),
        takeUntilDestroyed(),
        finalize(() => this.loading.delete('getting code')),
      )
      .subscribe(result => {
        console.debug(result);
        // console.debug(sessionStorage);
        // location.href = result;
      });
  }
}