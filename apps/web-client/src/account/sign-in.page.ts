import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, FormImports, ImportsModule, generateLoadingState } from '@easworks/app-shell';
import { pattern } from '@easworks/models';

@Component({
  selector: 'account-sign-in-page',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImports,
    RouterModule
  ]
})
export class AccountSignInPageComponent {
  protected readonly auth = inject(AuthService);

  protected readonly loading = generateLoadingState<['signing in']>();

  @HostBinding()
  private readonly class = 'page grid';

  protected readonly emailLogin = {
    form: new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.pattern(pattern.email)],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    }, { updateOn: 'submit' }),
    submit: () => {
      if (!this.emailLogin.form.valid)
        return;

      this.loading.add('signing in');
      this.auth.signin.email(this.emailLogin.form.getRawValue())
        .subscribe({
          complete: () => this.loading.delete('signing in')
        });
    }
  } as const;
}