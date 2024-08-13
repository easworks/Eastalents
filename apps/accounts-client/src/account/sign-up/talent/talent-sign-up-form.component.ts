import { ChangeDetectionStrategy, Component, computed, effect, HostBinding, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthApi } from '@easworks/app-shell/api/auth.api';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faFacebook, faGithub, faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { RETURN_URL_KEY } from 'models/auth';
import { ExternalIdentityProviderType, ExternalIdpUser } from 'models/identity-provider';
import { pattern } from 'models/pattern';
import { ProblemDetails } from 'models/problem-details';
import { SignUpInput } from 'models/validators/auth';
import { catchError, EMPTY, finalize, map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'talent-sign-up-form',
  templateUrl: './talent-sign-up-form.component.html',
  styleUrl: './talent-sign-up-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    RouterModule
  ]
})
export class TalentSignUpFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);

  private readonly api = {
    auth: inject(AuthApi)
  } as const;

  @HostBinding()
  private readonly class = 'block @container';

  protected readonly icons = {
    faGoogle,
    faGithub,
    faLinkedinIn,
    faFacebook
  } as const;

  private readonly loading = generateLoadingState<[
    'signing up'
  ]>();

  protected readonly query$ = toSignal(this.route.queryParams, { requireSync: true });
  protected readonly socialPrefill$ = toSignal(this.route.data.pipe(map(d => d['socialPrefill'])), { requireSync: true });

  private readonly returnUrl$ = toSignal(this.route.queryParamMap.pipe(map(q => q.get(RETURN_URL_KEY))), { requireSync: true });

  protected readonly readOnly$ = computed(() => !!this.socialPrefill$());

  protected readonly showSocial$ = computed(() => !this.socialPrefill$());

  protected readonly accountBasics = (() => {
    const formId = 'talent-sign-up-account-basics';
    const form = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      firstName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      lastName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern(pattern.password)],
        nonNullable: true
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
    }, {
      validators: [
        (c) => {
          const isMatch = c.value.password === c.value.confirmPassword;
          if (isMatch)
            return null;
          else
            return { passwordMismatch: true };
        }
      ],
      updateOn: 'submit'
    });

    effect(() => {
      const stopEmit = { onlySelf: true, };
      const prefill = this.socialPrefill$()?.externalUser as ExternalIdpUser | undefined;
      if (prefill) {
        form.controls.password.disable(stopEmit);
        form.controls.confirmPassword.disable(stopEmit);

        form.reset({}, stopEmit);
        form.patchValue({
          firstName: prefill.firstName,
          lastName: prefill.lastName,
          email: prefill.email,
        }, stopEmit);
      }
      else {
        form.controls.password.enable(stopEmit);
        form.controls.confirmPassword.enable(stopEmit);

        form.reset({}, stopEmit);
      }

      form.updateValueAndValidity();

    });

    const submit = {
      click: () => {
        if (!form.valid)
          return;

        const fv = form.getRawValue();
        const prefill = this.socialPrefill$();

        const input: SignUpInput = {
          username: fv.username,
          firstName: fv.firstName,
          lastName: fv.lastName,
          email: fv.email,
          role: 'talent',
          credentials: prefill ?
            {
              provider: prefill.idp,
              accessToken: prefill.externalUser.credential
            } :
            {
              provider: 'email',
              password: fv.password
            }
        };

        this.loading.add('signing up');

        this.api.auth.signup(input)
          .pipe(
            switchMap(output => {
              if (output.action === 'sign-in') {
                return this.auth.signIn.token(output.data.access_token, this.returnUrl$() || undefined);
              }
              else {
                return this.router.navigateByUrl('/verify-email');
              }
            }),
            catchError((err: ProblemDetails) => {
              SnackbarComponent.forError(this.snackbar, err);
              return EMPTY;
            }),
            finalize(() => this.loading.delete('signing up'))
          ).subscribe();
      },
      disabled$: this.loading.any$,
      loading$: this.loading.has('signing up')
    } as const;


    return {
      formId,
      form,
      submit
    } as const;

  })();



  socialSignUp(provider: ExternalIdentityProviderType) {
    this.auth.signUp.social(provider, 'talent', this.returnUrl$() || undefined);
  }
}