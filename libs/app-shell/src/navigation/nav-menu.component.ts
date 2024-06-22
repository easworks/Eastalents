import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { Domain } from '@easworks/models';
import { faAngleDown, faBriefcase, faClipboard, faDashboard, faHandshakeAngle, faMicrochip, faQuestion, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { DomainState } from '../state/domains';
import { MenuItem, NOOP_CLICK, NavMenuState } from '../state/menu-refactor/nav-menu';
import { SelectableOption } from '../utilities/options';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppNavMenuComponent {

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
  private readonly workOpportunitySubMenu : MenuItem[] = [
    {id:"work-opportunity-all-jobs", text: 'All Jobs', link: "/dashboard/work-opportunity-all-jobs"},
    {id:"work-opportunity-my-applications", text: 'My Applications', link: "/dashboard/work-opportunity-my-applications"},
    {id:"work-opportunity-saved-jobs", text: 'Saved Jobs', link: "/dashboard/work-opportunity-saved-jobs"},
  ];
  protected readonly navStaticMenuItems: MenuItem[] = [
    {id:"dashboard", text: 'Dashboard', link: "/dashboard", icon: faDashboard},
    {id:"my-profile", text: 'My Profile', link: "/dashboard/my-profile", icon: faUser},
    {id:"work-opportunity", text: 'Work Opportunity', link: "/dashboard/work-opportunity-all-jobs", icon: faBriefcase, children: this.workOpportunitySubMenu },
    {id:"gen-ai-vetting", text: 'Gen AI Vetting', link: "/dashboard/gen-ai-vetting", icon: faMicrochip},
    {id:"help", text: 'Help', link: "/dashboard/help", icon: faQuestion},
    {id:"your-spoc", text: 'Your SPOC', link: "/dashboard/your-spoc" , icon: faHandshakeAngle},
    {id:"my-account", text: 'My Account', link: "/dashboard/my-account", icon: faClipboard}
  ];
  
  protected readonly logoutMenu : MenuItem[] = [
    {id:"logout", text: 'Logout', link: NOOP_CLICK, icon: faRightFromBracket},

  ]
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

    const loading$ = computed(() => domains$().length === 0);

    return {
      loading$,
      selected$,
      domains$,
      filter$,
      selectDomain
    } as const;
  }

  toggleOpen(listItem: HTMLLIElement) {
    const shouldAdd = !listItem.classList.contains('open');
    if (shouldAdd) {
      listItem.classList.add('open');
    }
    else {
      listItem.classList.remove('open');
    }
  }
}