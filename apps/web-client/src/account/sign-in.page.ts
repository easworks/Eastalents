import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService, AuthState, FormImports, ImportsModule, generateLoadingState } from '@easworks/app-shell';
import { RETURN_URL_KEY, pattern } from '@easworks/models';

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

  protected readonly state = inject(AuthState);

  protected readonly loading = generateLoadingState<['signing in']>();

  private readonly returnUrl = inject(ActivatedRoute).snapshot.queryParamMap.get(RETURN_URL_KEY) || undefined;

  @HostBinding()
  private readonly class = 'page grid content-center';

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

      this.auth.signin.email(
        this.emailLogin.form.getRawValue(),
        { isNewUser: false, returnUrl: this.returnUrl }
      ).subscribe({
        next: () => this.loading.delete('signing in'),
        error: () => this.loading.delete('signing in')
      });
    }
  } as const;

  protected signOut() {
    this.auth.signOut();
  }
}