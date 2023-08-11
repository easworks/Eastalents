import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountApi } from '@easworks/app-shell/api/account.api';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { pattern } from '@easworks/models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'account-password-reset-page',
  templateUrl: './password-reset.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    FontAwesomeModule
  ]
})
export class AccountPasswordResetPageComponent {
  private readonly api = {
    account: inject(AccountApi)
  } as const;
  private readonly snackbar = inject(MatSnackBar);

  protected readonly icons = {
    faCircleCheck
  } as const;

  @HostBinding()
  private readonly class = 'page grid content-center';

  protected readonly mode$ = signal<'send link' | 'set password'>('send link');
  protected readonly loading = generateLoadingState<['sending link']>();

  protected readonly sendLink = {
    form: new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.pattern(pattern.email)],
        nonNullable: true
      })
    }),
    submit: () => {
      if (!this.sendLink.form.valid)
        return;

      this.loading.add('sending link');
      const { email } = this.sendLink.form.getRawValue();
      this.api.account.resetPassword.sendLink(email)
        .then(() => {
          this.sendLink.sent$.set(true);
        })
        .catch(e => {
          this.snackbar.openFromComponent(SnackbarComponent, ErrorSnackbarDefaults);
          this.sendLink.form.controls.email.setErrors({ server: e.message });
        })
        .finally(() => this.loading.delete('sending link'));
    },
    sent$: signal(false)
  };

}
