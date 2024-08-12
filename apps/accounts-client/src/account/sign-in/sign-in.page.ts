import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faFacebook, faGithub, faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { RETURN_URL_KEY } from 'models/auth';
import { ExternalIdentityProviderType } from 'models/identity-provider';
import { ProblemDetails } from 'models/problem-details';
import { catchError, EMPTY, finalize, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'sign-in-page',
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    RouterModule
  ]
})
export class SignInPageComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);

  @HostBinding()
  private readonly class = 'page grid place-content-center @container';

  protected readonly icons = {
    faGoogle,
    faGithub,
    faLinkedinIn,
    faFacebook
  } as const;

  private readonly loading = generateLoadingState<[
    'signing in'
  ]>();

  private readonly returnUrl$ = toSignal(this.route.queryParamMap.pipe(map(q => q.get(RETURN_URL_KEY))), { requireSync: true });

  protected readonly emailLogin = {
    formId: 'signin-email',
    form: new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    }, { updateOn: 'submit' }),
    submit: () => {
      if (!this.emailLogin.form.valid)
        return;

      this.loading.add('signing in');

      this.auth.signIn.email(
        this.emailLogin.form.getRawValue(),
        this.returnUrl$() || undefined
      ).pipe(
        catchError((err: ProblemDetails) => {
          if (err.type === 'user-email-not-registered') {
            this.emailLogin.form.controls.email.setErrors({ notRegistered: true });
          }
          else if (err.type === 'invalid-password') {
            this.emailLogin.form.controls.password.setErrors({ invalidPassword: true });
          }
          else {
            SnackbarComponent.forError(this.snackbar);
          }

          return EMPTY;
        }),
        finalize(() => {
          this.loading.delete('signing in');
        })
      ).subscribe();
    },
    button: {
      disabled$: this.loading.any$,
      loading$: this.loading.has('signing in')
    }
  } as const;

  socialLogin(provider: ExternalIdentityProviderType) {
    this.auth.signIn.social(provider, this.returnUrl$() || undefined);
  }
}