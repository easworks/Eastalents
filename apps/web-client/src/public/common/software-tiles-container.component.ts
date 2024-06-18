import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { UI_FEATURE } from '@easworks/app-shell/state/ui';
import { Domain } from '@easworks/models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

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
  private readonly store = inject(Store);

  private readonly screenSize$ = this.store.selectSignal(UI_FEATURE.selectScreenSize);

  protected readonly icons = {
    faGear,
    faPlus,
    faMinus
  } as const;

  @Input({ required: true }) set domain(domain: DomainPartial) {
    this.domain$.set(domain);
  }

  private readonly domain$ = signal<DomainPartial | null>(null);
  protected readonly products$ = computed(() => {
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

  private readonly visibleRows$ = computed(() => {
    const showAll = this.showAll.$();
    if (showAll)
      return null;

    const ss = this.screenSize$();

    switch (ss) {
      case 'xs':
      case 'sm':
      case 'md':
      case 'lg':
      case 'xl': return 2;
      case '2xl':
      case '3xl':
      case '4xl':
      case '5xl':
      case '6xl':
      case '7xl':
      case '8xl':
      case '9xl':
      case '10xl': return 1;
    }
  });
  protected readonly rowTemplate$ = computed(() => {
    const vr = this.visibleRows$();
    return vr === null ? 'repeat(auto-fill, 4rem)' : `repeat(${vr}, 4rem)`;
  });
  protected readonly gridHeight$ = computed(() => {
    const vr = this.visibleRows$();
    return vr === null ? 'auto' : `${(vr * 4) + (vr - 1)}rem`;
  });

  protected readonly customCellPosition$ = computed(() => {
    const vr = this.visibleRows$();
    const column = vr === null ? 'auto' : -2;
    const row = vr === null ? 'auto' : vr;

    return `grid-row: ${row}; grid-column: ${column}`;
  });

  protected readonly customSoftwareLink$ = computed(() => `/software/custom/${this.shortName$()}`);
}

