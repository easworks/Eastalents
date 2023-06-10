import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountApi, AuthService, ErrorSnackbarDefaults, FormImports, ImportsModule, SnackbarComponent, generateLoadingState } from '@easworks/app-shell';
import { EmailSignUpRequest, pattern } from '@easworks/models';

@Component({
  selector: 'account-enterprise-sign-up-page',
  templateUrl: './enterprise-sign-up.page.html',
  styleUrls: ['./enterprise-sign-up.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImports,
    MatCheckboxModule
  ]
})
export class EnterpriseSignUpPageComponent {
  protected readonly auth = inject(AuthService);
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

  protected readonly form = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    company: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.pattern(pattern.email)],
      asyncValidators: [
        async (c) => {
          this.loading.add('validating email')
          const value = c.value as string;
          const blacklisted = await this.api.account.blackListedEmailDomains();

          let result;
          if (blacklisted.some(d => value.endsWith(d)))
            result = { blacklisted: true };
          else
            result = null;

          this.loading.delete('validating email');
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
        const isMatch = c.value.password === c.value.confirmPassword;
        if (isMatch)
          return null;
        else
          return { passwordMismatch: true }
      }
    ],
    updateOn: 'submit'
  });

  submit() {
    if (!this.form.valid)
      return;

    const { email, firstName, lastName, password } = this.form.getRawValue();

    const input: EmailSignUpRequest = {
      email,
      firstName,
      lastName,
      password,
      role: 'employer'
    };

    this.loading.add('signing up');
    this.api.account.signup(input)
      .subscribe({
        next: () => {
          this.loading.delete('signing up')
        },
        error: () => {
          this.snackbar.openFromComponent(SnackbarComponent, ErrorSnackbarDefaults);
          this.loading.delete('signing up');
        }
      });
  }
}
