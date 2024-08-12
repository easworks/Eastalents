import { Component, HostBinding, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'sign-up-page',
  templateUrl: './sign-up.page.html',
  styleUrl: './sign-up.page.less',
  imports: [
    ImportsModule,
    MatTabsModule,
    RouterModule
  ]
})
export class SignUpPageComponent {
  private readonly route = inject(ActivatedRoute);

  @HostBinding()
  private readonly class = 'page grid content-center 3xl:max-w-screen-3xl';

  protected readonly query$ = toSignal(this.route.queryParams, { requireSync: true });
  protected readonly socialPrefill$ = toSignal(this.route.data.pipe(map(d => d['socialPrefill'])), { requireSync: true });
}