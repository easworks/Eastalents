import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { ScreenSize, UI_FEATURE } from '@easworks/app-shell/state/ui';
import { Domain } from '@easworks/models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faGear } from '@fortawesome/free-solid-svg-icons';

type DomainPartial = Pick<Domain, 'key' | 'longName' | 'products'>;

@Component({
  standalone: true,
  selector: 'software-tiles-container',
  templateUrl: './software-tiles-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    MatRippleModule
  ]
})
export class SoftwareTilesContainerComponent {
  private readonly screenSize$ = inject(UI_FEATURE).selectors.screenSize$;
  protected readonly icons = { faGear, faAngleRight } as const;

  @Input({ required: true }) set domain(domain: DomainPartial) {
    this.domain$.set(domain);
  };

  private readonly domain$ = signal<DomainPartial | null>(null);
  private readonly products$ = computed(() => {
    const d = this.domain$();
    if (!d)
      return [];

    return d.products.map(p => ({
      name: p.name,
      image: `/assets/software/products/${d.key}/${p.name}.png`,
      link: `/software/${d.key}/${p.name}`
    }));
  });

  protected readonly label$ = computed(() => {
    const d = this.domain$();
    return d ? `${d.key} - ${d.longName}` : '';
  });

  protected readonly shortName$ = computed(() => this.domain$()?.key || '');

  protected readonly showAll = {
    $: signal(false),
    toggle: () => this.showAll.$.update(s => !s)
  } as const;

  protected readonly visibleProducts$ = computed(() => {
    const ss = this.screenSize$();
    const products = this.products$();
    const showAll = this.showAll.$();

    const toShow = showAll ?
      products :
      products.slice(0, mapScreenSizeToVisibleItems(ss));

    return toShow;
  });

  protected readonly customSoftwareLink$ = computed(() => `/software/custom/${this.shortName$()}`);
}

function mapScreenSizeToVisibleItems(size: ScreenSize) {
  switch (size) {
    case 'sm': return 5;
    case 'md': return 8;
    case 'lg': return 9;
    case 'xl': return 13;
  }
}
