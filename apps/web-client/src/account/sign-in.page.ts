import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthService } from '@easworks/app-shell/services/auth';
import { authFeature } from '@easworks/app-shell/state/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { RETURN_URL_KEY, pattern } from '@easworks/models';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

@Component({
  selector: 'account-sign-in-page',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    RouterModule
  ]
})
export class AccountSignInPageComponent {
  constructor() {
    if (this.user$() && this.returnUrl) {
      const currentPath = window.location.pathname;
      if (!this.returnUrl.startsWith(currentPath))
        this.router.navigateByUrl(this.returnUrl);
    }
  }

  protected readonly auth = inject(AuthService);
  private readonly store = inject(Store);
  protected readonly user$ = this.store.selectSignal(authFeature.selectUser);

  protected readonly loading = generateLoadingState<['signing in']>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly returnUrl = this.route.snapshot.queryParamMap.get(RETURN_URL_KEY) || undefined;

  protected readonly icons = {
    faCircleCheck
  } as const;

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
        this.returnUrl
      ).finally(() => this.loading.delete('signing in'));

    }
  } as const;

  protected signOut() {
    this.auth.signOut();
  }
}