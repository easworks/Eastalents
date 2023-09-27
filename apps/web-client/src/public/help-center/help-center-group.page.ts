import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { HelpGroup } from './data';

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

  protected readonly group$ = signal<HelpGroup>({
    title: '',
    slug: '',
    link: '',
    items: []
  });

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
    const g = this.group$();
    const i = this.item$();

    return [
      {
        text: 'Help Center',
        link: '/help-center'
      },
      {
        text: g.title,
        link: `/help-center/${g.slug}`
      },
      {
        text: i.title,
        link: `/help-center/${g.slug}`,
        fragment: i.slug
      }
    ];
  });

  private listenToRouteChanges() {
    const route = inject(ActivatedRoute);

    route.data.pipe(takeUntilDestroyed())
      .subscribe(d => {
        this.group$.set(d['group']);
      });

    route.fragment.pipe(takeUntilDestroyed())
      .subscribe(f => this.fragment$.set(f));
  }
}
