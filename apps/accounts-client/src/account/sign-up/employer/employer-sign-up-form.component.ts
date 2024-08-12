import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthService } from '@easworks/app-shell/services/auth';
import { faFacebook, faGithub, faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { RETURN_URL_KEY } from 'models/auth';
import { ExternalIdentityProviderType } from 'models/identity-provider';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'employer-sign-up-form',
  templateUrl: './employer-sign-up-form.component.html',
  styleUrl: './employer-sign-up-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class EmployerSignUpFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  @HostBinding()
  private readonly class = 'block @container';

  protected readonly icons = {
    faGoogle,
    faGithub,
    faLinkedinIn,
    faFacebook
  } as const;

  protected readonly query$ = toSignal(this.route.queryParams, { requireSync: true });
  protected readonly socialPrefill$ = toSignal(this.route.data.pipe(map(d => d['socialPrefill'])), { requireSync: true });

  private readonly returnUrl$ = toSignal(this.route.queryParamMap.pipe(map(q => q.get(RETURN_URL_KEY))), { requireSync: true });

  socialSignUp(provider: ExternalIdentityProviderType) {
    this.auth.signUp.social(provider, 'employer', this.returnUrl$() || undefined);
  }
}