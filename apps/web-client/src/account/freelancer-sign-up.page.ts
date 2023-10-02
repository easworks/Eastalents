import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { AuthState } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { pattern } from '@easworks/models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'account-freelancer-sign-up-page',
  templateUrl: './freelancer-sign-up.page.html',
  styleUrls: ['./freelancer-sign-up.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FormImportsModule,
    MatCheckboxModule,
    FontAwesomeModule,
    RouterModule
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

  protected readonly icons = {
    faCheck
  } as const;

  @HostBinding()
  private readonly class = 'page';
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
          return { passwordMismatch: true };
      }
    ],
    updateOn: 'submit'
  });

  submit() {
    if (!this.form.valid)
      return;

    const { email, firstName, lastName, password } = this.form.getRawValue();
    this.loading.add('signing up');

    const query$ = this.partial ?
      this.auth.socialCallback.getToken(
        { authType: 'signup', userRole: 'freelancer', email, firstName, lastName, },
        { isNewUser: true }
      ) :
      this.auth.signup.email({ email, firstName, lastName, password, role: 'freelancer' });

    query$
      .catch(() => {
        this.snackbar.openFromComponent(SnackbarComponent, ErrorSnackbarDefaults);
      })
      .finally(() => {
        this.loading.delete('signing up');
      });
  }
}
