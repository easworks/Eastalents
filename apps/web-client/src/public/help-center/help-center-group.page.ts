import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { HelpCategory, HelpGroup } from '@easworks/app-shell/services/help';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'help-center-group-page',
  templateUrl: './help-center-group.page.html',
  styleUrls: ['./help-center-group.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    RouterModule
  ]
})
export class HelpCenterGroupPageComponent {
  constructor() {
    this.listenToRouteChanges();
  }

  @HostBinding()
  private readonly class = 'page';
  protected readonly icons = {
    faChevronRight
  } as const;

  private readonly category$ = signal(null as unknown as HelpCategory);

  protected readonly group$ = signal(null as unknown as HelpGroup);

  private readonly fragment$ = signal<string | null>(null);
  protected readonly item$ = computed(() => {
    const g = this.group$();
    const f = this.fragment$();
    if (!f) return g.items[0];

    const found = g.items.find(i => i.slug === f);
    if (!found) return g.items[0];

    return found;
  });

  protected readonly breadcrumb$ = computed(() => {
    const c = this.category$();
    const g = this.group$();

    return [
      {
        text: 'Help Center',
        link: '/help-center'
      },
      {
        text: c.title,
        link: '/help-center',
        fragment: c.slug
      },
      {
        text: g.title,
        link: `/help-center/${c.slug}/${g.slug}`
      }
    ];
  });

  private listenToRouteChanges() {
    const route = inject(ActivatedRoute);

    route.data.pipe(takeUntilDestroyed())
      .subscribe(d => {
        const content = d['content'];
        this.category$.set(content.category);
        this.group$.set(content.group);
      });

    route.fragment.pipe(takeUntilDestroyed())
      .subscribe(f => this.fragment$.set(f));
  }
}
