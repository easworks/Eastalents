import { Component, DestroyRef, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DevelopmentApi } from '@easworks/app-shell/api/development.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { ENVIRONMENT_ID } from '@easworks/app-shell/dependency-injection';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { authFeature } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sleep } from '@easworks/app-shell/utilities/sleep';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { catchError, finalize, map, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'sign-in-success-page',
  templateUrl: './sign-in-success.page.html',
  imports: [
    ImportsModule
  ]
})
export class SignInSuccessPageComponent {
  private readonly store = inject(Store);
  private readonly auth = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly dRef = inject(DestroyRef);

  private readonly api = {
    development: inject(DevelopmentApi)
  } as const;

  @HostBinding()
  private readonly class = 'page grid place-content-center';

  private readonly loading = generateLoadingState<[
    'deleting account'
  ]>();


  protected readonly icons = {
    faCheckCircle
  } as const;

  protected readonly user$ = this.store.selectSignal(authFeature.guaranteedUser);


  protected signOut() {
    this.auth.signOut();
  }

  protected readonly deleteSelf = (() => {

    const env = inject(ENVIRONMENT_ID);
    const allowed = env !== 'production';

    const loading$ = this.loading.has('deleting account');
    const disabled$ = this.loading.any$;

    const click = () => {
      this.loading.add('deleting account');
      this.api.development.deleteAccount()
        .pipe(
          tap(() => SnackbarComponent.forSuccess(this.snackbar)),
          tap(() => sleep().then(() => this.signOut())),
          catchError(e => {
            SnackbarComponent.forError(e);
            throw e;
          }),
          finalize(() => this.loading.delete('deleting account')),
          takeUntilDestroyed(this.dRef)
        ).subscribe();
    };

    return {
      allowed,
      click,
      loading$,
      disabled$
    } as const;
  })();

}