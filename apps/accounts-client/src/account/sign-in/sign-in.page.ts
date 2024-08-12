import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthService } from '@easworks/app-shell/services/auth';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { RETURN_URL_KEY } from 'models/auth';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'sign-in-page',
  templateUrl: './sign-in.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule
  ]
})
export class SignInPageComponent {

  private readonly snap = inject(ActivatedRoute).snapshot;
  private readonly auth = inject(AuthService);

  @HostBinding()
  private readonly class = 'page grid place-content-center';

  private readonly loading = generateLoadingState<[
    'signing in'
  ]>();

  protected readonly returnUrl = this.snap.queryParamMap.get(RETURN_URL_KEY);

  protected readonly emailLogin = {
    formId: 'signin-email',
    form: new FormGroup({
      email: new FormControl('dibyodyutimondalnfs@gmail.com', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      password: new FormControl('Easworks@121', {
        validators: [Validators.required],
        nonNullable: true
      })
    }, { updateOn: 'submit' }),
    submit: () => {
      if (!this.emailLogin.form.valid)
        return;

      this.loading.add('signing in');

      this.auth.signIn.email(
        this.emailLogin.form.getRawValue(),
        this.returnUrl || undefined
      ).pipe(
        finalize(() => {
          this.loading.delete('signing in');
        })
      ).subscribe();
    },
    button: {
      disabled$: this.loading.any$,
      loading$: this.loading.has('signing in')
    }
  } as const;

}