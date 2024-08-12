import { Component, HostBinding, inject } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthService } from '@easworks/app-shell/services/auth';
import { authFeature } from '@easworks/app-shell/state/auth';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'sign-in-success-page',
  templateUrl: './sign-in-success.page.html',
  imports: [
    ImportsModule
  ]
})
export class SignInSuccessPageComponent {
  private readonly store = inject(Store);
  private readonly auth = inject(AuthService);

  @HostBinding()
  private readonly class = 'page grid place-content-center';


  protected readonly icons = {
    faCheckCircle
  } as const;

  protected readonly user$ = this.store.selectSignal(authFeature.guaranteedUser);


  protected signOut() {
    this.auth.signOut();
  }
}