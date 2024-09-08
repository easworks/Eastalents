import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthApi } from '@easworks/app-shell/api/auth.api';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { isBrowser } from '@easworks/app-shell/utilities/platform-type';
import { pattern } from '@easworks/models/pattern';
import { ProblemDetails } from '@easworks/models/problem-details';
import { PasswordResetInput } from '@easworks/models/validators/auth';
import { catchError, EMPTY, finalize, first, interval, map, switchMap, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'password-reset-page',
  templateUrl: './password-reset.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    RouterModule
  ]
})
export class PasswordRestPageComponent {

  private readonly snackbar = inject(MatSnackBar);
  private readonly dRef = inject(DestroyRef);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = {
    auth: inject(AuthApi)
  } as const;

  @HostBinding()
  private readonly class = 'page grid place-content-center';

  private readonly loading = generateLoadingState<[
    'validating email exists',
    'sending verification code',
    'validating verification code',
    'setting password'
  ]>();

  protected readonly step$ = signal<Step>('send verification code');

  protected readonly emailForm = (() => {
    const form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      })
    }, { updateOn: 'submit' });


    const submit = () => {
      if (!form.valid)
        return;

      const email = form.getRawValue().email;

      this.loading.add('validating email exists');
      this.auth.passwordReset.sendCode(email)
        .pipe(
          map(() => this.step$.set('validate verification code')),
          catchError((err: ProblemDetails) => {
            switch (err.type) {
              case 'user-email-not-registered':
                form.controls.email.setErrors({ notRegistered: true });
                break;
              default:
                SnackbarComponent.forError(this.snackbar);
                break;
            }
            return EMPTY;
          }),
          finalize(() => this.loading.delete('validating email exists')),
          takeUntilDestroyed(this.dRef)
        ).subscribe();
    };

    const disabled$ = this.loading.any$;
    const loading$ = this.loading.has('validating email exists');


    return {
      form,
      disabled$,
      loading$,
      submit
    } as const;
  })();

  protected readonly otpForm = (() => {
    const form = new FormGroup({
      code: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(pattern.otp.number)
        ]
      })
    }, { updateOn: 'submit' });

    const loading$ = this.loading.has('validating verification code');
    const disabled$ = this.loading.any$;

    const value$ = signal<{ code: string, code_verifier: string; }>(
      { code: '', code_verifier: '' }
    );

    const submit = () => {
      if (!form.valid)
        return;
      this.loading.add('validating verification code');

      const email = this.emailForm.form.getRawValue().email;
      const code = form.getRawValue().code;

      this.auth.passwordReset.verifyCode(email, code)
        .pipe(
          map(code_verifier => {
            value$.set({ code, code_verifier });
            this.step$.set('change password');
          }),
          catchError((e: ProblemDetails) => {
            switch (e.type) {
              case 'pasword-reset-code-expired':
                form.controls.code.setErrors({ 'invalid': true });
                break;
              default:
                SnackbarComponent.forError(this.snackbar, e);
                break;
            }
            return EMPTY;
          }),
          finalize(() => this.loading.delete('validating verification code')),
          takeUntilDestroyed(this.dRef)
        ).subscribe();
    };

    return {
      form,
      disabled$,
      loading$,
      value$,
      submit
    } as const;
  })();

  protected readonly passwordForm = (() => {

    const form = new FormGroup({
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
          const { password, confirmPassword } = c.value;
          const isMatch = password === confirmPassword;
          if (isMatch)
            return null;
          else
            return { passwordMismatch: true };
        }
      ],
      updateOn: 'submit'
    });

    const loading$ = this.loading.has('setting password');
    const disabled$ = this.loading.any$;

    const submit = () => {
      if (!form.valid)
        return;

      this.loading.add('setting password');

      const email = this.emailForm.form.getRawValue().email;
      const code = this.otpForm.value$();
      const password = form.getRawValue().password;

      const input: PasswordResetInput = {
        email,
        ...code,
        password
      };

      this.api.auth.passwordReset.setPassword(input)
        .pipe(
          map(() => {
            SnackbarComponent.forSuccess(this.snackbar);
            this.step$.set('redirect to signin');
          }),
          catchError((e: ProblemDetails) => {
            SnackbarComponent.forError(this.snackbar, e);
            this.step$.set('restart process');
            return EMPTY;
          }),
          finalize(() => this.loading.delete('setting password')),
          takeUntilDestroyed(this.dRef)
        ).subscribe();

    };

    return {
      form,
      loading$,
      disabled$,
      submit
    } as const;
  })();

  protected readonly postFailure = (() => {

    const counter$ = signal(15);

    if (isBrowser()) {
      toObservable(this.step$)
        .pipe(
          first(step => step === 'restart process'),
          switchMap(() => interval(1000)),
          take(15),
          takeUntilDestroyed(),
        ).subscribe({
          next: () => counter$.update(v => --v),
          complete: () => click()
        });
    }

    const click = () => location.reload();

    return {
      counter$,
      click
    } as const;

  })();

  protected readonly postSuccess = (() => {
    const counter$ = signal(15);

    if (isBrowser()) {
      toObservable(this.step$)
        .pipe(
          first(step => step === 'redirect to signin'),
          switchMap(() => interval(1000)),
          take(15),
          takeUntilDestroyed(),
        ).subscribe({
          next: () => counter$.update(v => --v),
          complete: () => click()
        });
    }

    const click = () => this.router.navigateByUrl('/sign-in');

    return {
      counter$,
      click
    } as const;

  })();
}

type Step =
  'send verification code' |
  'validate verification code' |
  'change password' |
  'redirect to signin' |
  'restart process';