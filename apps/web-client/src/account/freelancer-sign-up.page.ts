import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, AuthState, ErrorSnackbarDefaults, FormImports, ImportsModule, LottiePlayerDirective, SnackbarComponent, generateLoadingState } from '@easworks/app-shell';
import { pattern } from '@easworks/models';

@Component({
  selector: 'account-freelancer-sign-up-page',
  templateUrl: './freelancer-sign-up.page.html',
  styleUrls: ['./freelancer-sign-up.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FormImports,
    MatCheckboxModule
  ]
})
export class FreelancerSignUpPageComponent {
  constructor() {
    const state = inject(AuthState);
    this.partial = state.partialSocialSignIn$();
    state.partialSocialSignIn$.set(null);

    if (this.partial) {
      this.form.reset(this.partial);
      this.form.controls.password.disable();
      this.form.controls.confirmPassword.disable();
    }
  }

  protected readonly auth = inject(AuthService);
  protected readonly partial;

  private readonly snackbar = inject(MatSnackBar);

  @HostBinding()
  private readonly class = 'page grid grid-cols-10 gap-4';
  protected readonly loading = generateLoadingState<['signing up']>();


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
  })

  submit() {
    if (!this.form.valid)
      return;

    const { email, firstName, lastName, password } = this.form.getRawValue();
    this.loading.add('signing up');

    const query$ = this.partial ?
      this.auth.socialCallback.getToken(
        { authType: 'signup', role: 'freelancer', email, firstName, lastName, },
        { isNewUser: true }
      ) :
      this.auth.signup.email({ email, firstName, lastName, password, role: 'freelancer' });

    query$.subscribe({
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
