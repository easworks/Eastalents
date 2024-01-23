import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AccountApi } from '@easworks/app-shell/api/account.api';
import { controlStatus$, controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { AuthState } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { emailBlacklist } from '@easworks/app-shell/validators/email-blacklist';
import { pattern } from '@easworks/models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'account-employer-sign-up-page',
  templateUrl: './employer-sign-up.page.html',
  styleUrls: ['./employer-sign-up.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatCheckboxModule,
    FontAwesomeModule,
    RouterModule
  ]
})
export class EmployerSignUpPageComponent {
  constructor() {
    const status = toSignal(controlStatus$(this.form));
    const pending = computed(() => status() === 'PENDING');
    this.loading.react('form pending', pending);
  }

  protected readonly auth = inject(AuthService);
  protected readonly authState = inject(AuthState);

  private readonly api = {
    account: inject(AccountApi)
  };
  private readonly snackbar = inject(MatSnackBar);

  protected readonly icons = {
    faCheck
  } as const;

  @HostBinding()
  private readonly class = 'page';
  protected readonly loading = generateLoadingState<[
    'signing up',
    'form pending'
  ]>();

  protected readonly form = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.pattern(pattern.email)],
      asyncValidators: [
        emailBlacklist(this.api.account.freeEmailProviders())
      ],
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
    tncAgreement: new FormControl(false, {
      validators: [Validators.requiredTrue],
      nonNullable: true
    })
  }, {
    validators: [
      (c) => {
        if (c.value.password && c.value.confirmPassword) {
          if (c.value.password !== c.value.confirmPassword)
            return { passwordMismatch: true };
        }
        return null;
      }
    ],
    updateOn: 'submit'
  });

  protected readonly prefilledEmail = this.authState.partialSocialSignIn$()?.email;
  protected readonly prefillSocial$ = this.shouldPrefillSocial();

  submit() {
    if (!this.form.valid)
      return;

    this.loading.add('signing up');
    const { email, firstName, lastName, password } = this.form.getRawValue();

    const partial = this.prefillSocial$();

    const query$ = partial ?
      this.auth.socialCallback.getToken(
        { authType: 'signup', userRole: 'employer', email, firstName, lastName },
        { isNewUser: true }
      ) :
      this.auth.signup.email({ email, firstName, lastName, password, userRole: 'employer' });

    query$
      .catch(() => {
        this.snackbar.openFromComponent(SnackbarComponent, ErrorSnackbarDefaults);
      })
      .finally(() => {
        this.loading.delete('signing up');
      });
  }

  private shouldPrefillSocial() {

    const partial = this.authState.partialSocialSignIn$();
    this.authState.partialSocialSignIn$.set(null);

    const partialAccepted$ = signal<boolean | undefined>(undefined);

    if (partial) {
      this.form.reset(partial);
      this.form.controls.password.disable();
      this.form.controls.confirmPassword.disable();
      this.form.markAsDirty();
      this.form.controls.email.markAsDirty();

      const control = this.form.controls.email;
      const status$ = toSignal(controlStatus$(control));
      const value$ = toSignal(controlValue$(control), { requireSync: true });

      toPromise(status$, s => s !== 'PENDING')
        .then(async s => {
          if (s === 'VALID') {
            partialAccepted$.set(true);
          }
          else {
            control.reset();
            this.form.controls.password.enable();
            this.form.controls.confirmPassword.enable();
            partialAccepted$.set(false);

            await toPromise(value$, v => v !== partial.email);
            partialAccepted$.set(undefined);
          }
        });
    }

    return partialAccepted$;
  }
}
