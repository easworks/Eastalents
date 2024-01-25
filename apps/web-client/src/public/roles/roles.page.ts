import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { Domain } from '@easworks/models';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { DomainSoftwareSelectorComponent } from '../common/domain-software-selector.component';
import { RoleSoftwareTalentComponent } from '../common/role-software-talent.component';
import { SoftwareTilesContainerComponent } from '../common/software-tiles-container.component';

@Component({
  standalone: true,
  selector: 'roles-page',
  templateUrl: './roles.page.html',
  styleUrl: './roles.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    RoleSoftwareTalentComponent,
    DomainSoftwareSelectorComponent,
    SoftwareTilesContainerComponent,
    RouterModule
  ]
})
export class RolesPageComponent {
  constructor() {
    {
      const combo$ = computed(() => {
        const d = this.domain$();
        const r = this.role$();
        if (d && r)
          return r;
        return '';
      });

      this.text = { combo$ } as const;
    }

    this.route.data
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.domain$.set(data['domain']);
        this.role$.set(data['role']);
      });
  }

  private readonly route = inject(ActivatedRoute);

  protected readonly icons = {
    faAngleRight
  } as const;

  protected readonly domain$ = signal<Domain | null>(null);
  protected readonly role$ = signal<string | null>(null);

  protected readonly roleList$ = computed(() => {
    const domain = this.domain$();

    if (!domain)
      return [];

    const allRoles = new Set(domain.modules
      .map(m => m.roles)
      .flat());

    const list = [...allRoles]
      .sort(sortString)
      .map(r => ({
        name: r,
        link: `/roles/${domain.key}/${r}`
      }));

    return list;
  });

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
