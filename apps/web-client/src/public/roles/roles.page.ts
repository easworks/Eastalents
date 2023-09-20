import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { RoleSoftwareTalentComponent } from '../common/role-software-talent.component';
import { DomainSoftwareSelectorComponent } from '../common/domain-software-selector.component';
import { Domain } from '@easworks/models';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'roles-page',
  templateUrl: './roles.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    RoleSoftwareTalentComponent,
    DomainSoftwareSelectorComponent
  ]
})
export class RolesPageComponent {
  constructor() {
    {
      const domain$ = computed(() => this.domain$()?.key);
      const combo$ = computed(() => {
        const d = this.domain$();
        const r = this.role$();
        if (d && r)
          return r;
        return '';
      });

      this.text = { domain$, combo$ } as const;
    }

    this.route.data
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.domain$.set(data['domain']);
        this.role$.set(data['role']);
      });
  }

  private readonly route = inject(ActivatedRoute);
  private readonly domain$ = signal<Domain | null>(null);
  private readonly role$ = signal<string | null>(null);

  protected readonly text;

  protected readonly customerLogos = [
    'client-1.png',
    'client-2.png',
    'client-3.png',
    'client-4.png',
    'client-5.png',
    'client-1.png',
  ].map(v => `/assets/img/${v}`);
}
