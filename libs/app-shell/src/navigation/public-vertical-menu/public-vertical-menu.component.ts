import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { ImportsModule } from '../../common/imports.module';
import { DomainState } from '../../state/domains';
import { MenuItem } from '../models';

@Component({
  standalone: true,
  selector: 'public-vertical-menu',
  templateUrl: './public-vertical-menu.component.html',
  styleUrls: ['./public-vertical-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    RouterModule
  ]
})
export class PublicVerticalMenuComponent {

  @HostBinding()
  private readonly class = 'grid gap-4 p-4';
  private readonly domainState = inject(DomainState);

  protected readonly icons = { faAngleDown } as const;

  // protected readonly domains = this.initDomainSection();

  public readonly publicItems$ = input.required<MenuItem[]>({ alias: 'public' });
  public readonly staticItems$ = input.required<MenuItem[]>({ alias: 'static' });
  public readonly aboutItems$ = input.required<MenuItem[]>({ alias: 'about' });
  public readonly socialItems$ = input.required<MenuItem[]>({ alias: 'social' });

  protected readonly showPublicMenu$ = computed(() => this.publicItems$().length > 0);

  // private initDomainSection() {
  //   const selected$ = signal<SelectableOption<Domain> | null>(null);
  //   const domains$ = computed(() => this.domainState.domains.list$().map(d => ({
  //     value: d,
  //     selected: false
  //   } satisfies SelectableOption<Domain>)));

  //   const selectDomain = (value: SelectableOption<Domain>) => {
  //     const selected = selected$();
  //     if (selected)
  //       selected.selected = false;
  //     value.selected = true;
  //     selected$.set(value);
  //   };

  //   const filter$ = signal('');

  //   const products$ = computed(() => {
  //     const selected = selected$();
  //     if (!selected)
  //       return [];
  //     return selected.value.products
  //       .map(p => ({
  //         name: p.name,
  //         link: `/software/${selected.value.key}/${p.name}`
  //       } as MenuItem));
  //   });

  //   const filteredProducts$ = computed(() => {
  //     const filter = filter$().toLowerCase();
  //     return products$()
  //       .filter(p => p.name.toLowerCase().includes(filter));
  //   });

  //   const loading$ = computed(() => domains$().length === 0);

  //   return {
  //     loading$,
  //     selected$,
  //     domains$,
  //     filter$,
  //     filteredProducts$,
  //     selectDomain
  //   } as const;
  // }

  toggleOpen(listItem: HTMLLIElement) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const shouldAdd = !listItem.classList.contains('open');

    if (shouldAdd) {
      listItem.classList.add('open');
    }
    else {
      listItem.classList.remove('open');
    }
  }
}