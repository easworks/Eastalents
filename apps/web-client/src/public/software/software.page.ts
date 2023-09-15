import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { Domain, SoftwareProduct } from '@easworks/models';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { DomainSoftwareSelectorComponent } from '../common/domain-software-selector.component';
import { RoleSoftwareTalentComponent } from '../common/role-software-talent.component';

@Component({
  standalone: true,
  selector: 'software-page',
  templateUrl: './software.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    RoleSoftwareTalentComponent,
    DomainSoftwareSelectorComponent,
    ImportsModule,
    RouterModule
  ]
})
export class SoftwarePageComponent {
  constructor() {
    {
      const domain$ = computed(() => this.domain$()?.key);
      const software$ = computed(() => this.software$()?.name);
      const combo$ = computed(() => {
        const d = domain$();
        const s = software$();
        if (d && s)
          return `${s} - ${d}`;
        return '';
      });

      this.text = { domain$, software$, combo$ } as const;
    }

    this.route.data
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.domain$.set(data['domain']);
        this.software$.set(data['software']);
      });
  }

  private readonly route = inject(ActivatedRoute);

  protected readonly icons = { faAngleRight } as const;

  private readonly domain$ = signal<Domain | null>(null);
  private readonly software$ = signal<SoftwareProduct | null>(null);

  protected readonly text;

  protected readonly roleLinks$ = computed(() => {
    const d = this.domain$();
    if (!d)
      return [];

    const roles = [... new Set(d.modules.flatMap(m => m.roles))].sort(sortString);

    const links = roles.map(role => ({
      role,
      link: `/roles/${d.key}/${role}`
    }));
    return links;
  });

  protected readonly clientImages = [
    '/assets/img/client-1.png',
    '/assets/img/client-2.png',
    '/assets/img/client-3.png',
    '/assets/img/client-4.png',
    '/assets/img/client-5.png',
    '/assets/img/client-1.png',
  ];
}
