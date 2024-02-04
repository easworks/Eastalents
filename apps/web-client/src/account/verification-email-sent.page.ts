import { Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountApi } from '@easworks/app-shell/api/account.api';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent, SuccessSnackbarDefaults } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';

@Component({
  standalone: true,
  selector: 'verification-email-sent-page',
  templateUrl: './verification-email-sent.page.html',
  imports: [
    ImportsModule,
    FormImportsModule
  ]
})
export class VerificationEmailSentPageComponent {

  private readonly auth = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);

  @HostBinding() private readonly class = 'page py-32 lg:max-w-screen-lg';

  protected readonly loading = generateLoadingState<[
    'verifying link'
  ]>();
  protected readonly submitting$ = this.loading.has('verifying link');

  protected readonly form = new FormGroup({
    link: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })
  }, {
    updateOn: 'submit'
  });

  protected async submit() {
    if (!this.form.valid)
      return;

    try {
      this.loading.add('verifying link');

      let token;
      try {
        const url = new URL(this.form.getRawValue().link);
        token = url.searchParams.get('token');
        if (!token)
          throw new Error('token paramter not found');
      }
      catch (e) {
        this.form.controls.link.setErrors({ 'cannot-parse': true });
        return;
      }

      await this.auth.signup.verifyEmail(token);
    }
    catch (err) {
      SnackbarComponent.forError(this.snackbar, err);
    }
    finally {
      this.loading.delete('verifying link');
    }
  }
}
