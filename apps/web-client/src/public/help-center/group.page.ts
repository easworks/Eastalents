import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { HelpCategory, HelpGroup } from '@easworks/app-shell/services/help';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FAQ, FAQListComponent } from '../common/faq-list.component';

@Component({
  standalone: true,
  selector: 'help-center-group-page',
  templateUrl: './group.page.html',
  styleUrl: './group.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    RouterModule,
    FAQListComponent
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

  protected readonly faqs$ = computed(() => {
    const items = this.group$().items;

    return items.map<FAQ>(i => ({
      content: i.content,
      question: i.title
    }));
  });

  protected readonly expandIndex$ = computed(() => {
    const fragment = this.fragment$();
    const faqs = this.group$().items;
    return faqs.findIndex(f => f.slug === fragment);
  });

  protected readonly breadcrumb$ = computed(() => {
    const c = this.category$();

    return [
      {
        text: 'Help Center',
        link: '/help-center'
      },
      {
        text: c.title,
        link: `/help-center/${c.slug}`,
      },
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
