import { Component, inject, signal, Type } from '@angular/core';
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

  protected readonly query$ = toSignal(this.route.queryParams, { requireSync: true });
  protected readonly socialPrefill$ = toSignal(this.route.data.pipe(map(d => d['socialPrefill'])), { requireSync: true });
  public readonly cards$ = signal<Type<unknown> | null>(null);
}