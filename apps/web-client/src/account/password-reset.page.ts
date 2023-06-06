import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountApi, ErrorSnackbarDefaults, FormImports, ImportsModule, SnackbarComponent, generateLoadingState } from '@easworks/app-shell';
import { pattern } from '@easworks/models';

@Component({
  selector: 'account-password-reset-page',
  templateUrl: './password-reset.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImports
  ]
})
export class AccountPasswordResetPageComponent {
  private readonly api = {
    account: inject(AccountApi)
  } as const;
  private readonly snackbar = inject(MatSnackBar);

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

      this.loading.add('sending link')
      const { email } = this.sendLink.form.getRawValue();
      this.api.account.resetPassword.sendLink({ email })
        .subscribe({
          next: () => {
            this.sendLink.sent$.set(true);
            this.loading.delete('sending link');
          },
          error: (e) => {
            this.snackbar.openFromComponent(SnackbarComponent, ErrorSnackbarDefaults);
            this.sendLink.form.controls.email.setErrors({ server: e.message });
            this.loading.delete('sending link');
          }
        });
    },
    sent$: signal(false)
  }

}
