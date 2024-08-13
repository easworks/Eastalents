import { Component, computed, HostBinding, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RETURN_URL_KEY } from 'models/auth';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'sign-up-account-type-choice-page',
  templateUrl: './sign-up-account-type-choice.page.html',
  imports: [
    RouterModule
  ]
})
export class SignUpAccountTypeChoicePageComponent {
  private readonly route = inject(ActivatedRoute);

  @HostBinding()
  private readonly class = 'page';

  protected readonly query$ = toSignal(this.route.queryParams, { requireSync: true });
  protected readonly socialPrefill$ = toSignal(this.route.data.pipe(map(d => d['socialPrefill'])), { requireSync: true });
}
