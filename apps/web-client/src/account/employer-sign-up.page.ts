import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountApi } from '@easworks/app-shell/api/account.api';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { AuthState } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { pattern } from '@easworks/models';
import { first, interval, map } from 'rxjs';

@Component({
  selector: 'account-organization-sign-up-page',
  templateUrl: './employer-sign-up.page.html',
  styleUrls: ['./employer-sign-up.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatCheckboxModule
  ]
})
export class OrganizationSignUpPageComponent {
  // TODO: see if destroyRef and cdRef can be removed from this component
  private readonly dRef = inject(DestroyRef);
  private readonly cdRef = inject(ChangeDetectorRef);
  protected readonly auth = inject(AuthService);
  protected readonly authState = inject(AuthState);

  private readonly api = {
    account: inject(AccountApi)
  };
  private readonly snackbar = inject(MatSnackBar);

  @HostBinding()
  private readonly class = 'page grid grid-cols-10 gap-4';
  protected readonly loading = generateLoadingState<[
    'signing up',
    'validating email'
  ]>();

  private readonly blacklistedEmails = this.api.account.blackListedEmailDomains();

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
        async (c) => {
          this.loading.add('validating email');
          const value = c.value as string;
          const blacklisted = await this.blacklistedEmails;
          let result = null;

          if (blacklisted.some(d => value.endsWith(d)))
            result = { blacklisted: true };

          this.loading.delete('validating email');
          this.cdRef.markForCheck();
          return result;
        }
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

    const { email, firstName, lastName, password } = this.form.getRawValue();
    this.loading.add('signing up');

    const partial = this.prefillSocial$();

    const query$ = partial ?
      this.auth.socialCallback.getToken(
        { authType: 'signup', userRole: 'employer', email, firstName, lastName },
        { isNewUser: true }
      ) :
      this.auth.signup.email({ email, firstName, lastName, password, role: 'employer' });

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

      // we have to poll for status because of
      // https://github.com/angular/angular/issues/41519
      // TODO: use control.statusChanges when the bug is resolved
      interval(10)
        .pipe(
          map(() => control.status),
          first(s => s !== 'PENDING'),
          takeUntilDestroyed()
        ).subscribe(status => {
          if (status === 'VALID') {
            partialAccepted$.set(true);
          }
          else {
            control.reset();
            this.form.controls.password.enable();
            this.form.controls.confirmPassword.enable();
            partialAccepted$.set(false);

            control.valueChanges.pipe(first(v => v !== partial.email), takeUntilDestroyed(this.dRef))
              .subscribe(() => partialAccepted$.set(undefined));
          }
        });
    }

    return partialAccepted$;
  }
}
