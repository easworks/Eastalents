import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { Domain } from '../api';
import { DomainState, MenuItem, NOOP_CLICK, NavMenuState } from '../state';
import { SelectableOption, sortString, toPromise } from '../utilities';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppVerticalMenuComponent {

  @HostBinding()
  private readonly class = 'grid gap-4 p-4';
  private readonly menuState = inject(NavMenuState);
  private readonly domainState = inject(DomainState);

  protected readonly domains = this.initDomainSection();

  protected readonly publicMenu = {
    show$: computed(() => this.menuState.publicMenu.vertical$().length > 0),
    items: this.menuState.publicMenu.vertical$,
  } as const;

  protected readonly staticMenuItems: MenuItem[] = [
    { name: 'Hire Talent', link: NOOP_CLICK },
    { name: 'For Enterprises', link: NOOP_CLICK },
    { name: 'Join EASWORKS', link: NOOP_CLICK },
    { name: 'For Freelancers', link: NOOP_CLICK },
  ];

  protected readonly aboutMenuItems: MenuItem[] = [
    { name: 'Resources', link: NOOP_CLICK },
    { name: 'Blog', link: NOOP_CLICK },
    { name: 'Press Center', link: NOOP_CLICK },
    { name: 'About Andela', link: NOOP_CLICK },
    { name: 'Careers', link: NOOP_CLICK },
  ];

  protected readonly brandLinks: MenuItem[] = [
    { name: 'twitter', icon: 'twitter', link: NOOP_CLICK },
    { name: 'facebook', icon: 'facebook', link: NOOP_CLICK },
    { name: 'instagram', icon: 'instagram', link: NOOP_CLICK },
    { name: 'pinterest', icon: 'pinterest', link: NOOP_CLICK },
    { name: 'youtube', icon: 'youtube', link: NOOP_CLICK },
  ];

  private initDomainSection() {
    const selected$ = signal<SelectableOption<Domain> | null>(null);
    const domains$ = computed(() => this.domainState.domains$().map(d => ({
      value: d,
      selected: false
    } satisfies SelectableOption<Domain>)));

    const selectDomain = (value: SelectableOption<Domain>) => {
      const selected = selected$();
      if (selected)
        selected.selected = false;
      value.selected = true;
      selected$.set(value);
    };

    const filter$ = signal('');

    const products$ = computed(() => {
      const selected = selected$();
      if (!selected)
        return [];
      const products = selected.value.modules
        .map(m => m.products)
        .flat();
      return products.sort((a, b) => sortString(a.name, b.name));
    });

    const filteredProducts$ = computed(() => {
      const filter = filter$().toLowerCase();
      return products$()
        .filter(p => p.name.toLowerCase().includes(filter))
        .map(p => Object.assign(p, { link: NOOP_CLICK }));
    });

    toPromise(this.domainState.loading.set$, s => !s.has('domains'))
      .then(() => selectDomain(domains$()[0]));

    return {
      loading$: this.domainState.loading.has('domains'),
      selected$,
      domains$,
      filter$,
      filteredProducts$,
      selectDomain
    } as const;
  }

  toggleOpen($event: MouseEvent) {
    const target = $event.target as HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parent = target.parentElement!;
    const shouldAdd = !parent.classList.contains('open');

    if (shouldAdd) {
      parent.classList.add('open');
    }
    else {
      parent.classList.remove('open');
    }
  }
}