import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { Domain } from '@easworks/models';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { DomainState } from '../state/domains';
import { MenuItem, NOOP_CLICK, NavMenuState } from '../state/menu';
import { SelectableOption } from '../utilities/options';
import { faFacebook, faInstagram, faPinterest, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

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

  protected readonly icons = { faAngleDown } as const;

  protected readonly domains = this.initDomainSection();

  protected readonly publicMenu = {
    show$: computed(() => this.menuState.publicMenu.vertical$().length > 0),
    items: this.menuState.publicMenu.vertical$,
  } as const;

  protected readonly staticMenuItems: MenuItem[] = [
    { name: 'Hire Talent', link: NOOP_CLICK },
    { name: 'For Employers', link: NOOP_CLICK },
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
    { name: 'twitter', icon: faTwitter, link: NOOP_CLICK },
    { name: 'facebook', icon: faFacebook, link: NOOP_CLICK },
    { name: 'instagram', icon: faInstagram, link: NOOP_CLICK },
    { name: 'pinterest', icon: faPinterest, link: NOOP_CLICK },
    { name: 'youtube', icon: faYoutube, link: NOOP_CLICK },
  ];

  private initDomainSection() {
    const selected$ = signal<SelectableOption<Domain> | null>(null);
    const domains$ = computed(() => this.domainState.domains.list$().map(d => ({
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
      return selected.value.products;
    });

    const filteredProducts$ = computed(() => {
      const filter = filter$().toLowerCase();
      return products$()
        .filter(p => p.name.toLowerCase().includes(filter))
        .map(p => Object.assign(p, { link: NOOP_CLICK }));
    });

    const loading$ = computed(() => domains$().length === 0);

    return {
      loading$,
      selected$,
      domains$,
      filter$,
      filteredProducts$,
      selectDomain
    } as const;
  }

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