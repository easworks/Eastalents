import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Domain } from '@easworks/models';
import { faGear, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

type DomainPartial = Pick<Domain, 'key' | 'longName' | 'products'>;

@Component({
  standalone: true,
  selector: 'software-tiles-container',
  templateUrl: './software-tiles-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ]
})
export class SoftwareTilesContainerComponent {
  protected readonly icons = { faGear, faAngleRight } as const;

  @Input({ required: true }) set domain(domain: DomainPartial) {
    this.domain$.set(domain);
  };

  private readonly domain$ = signal<DomainPartial | null>(null);

  protected readonly label$ = computed(() => {
    const d = this.domain$();
    return d ? `${d.key} - ${d.longName}` : '';
  });

  protected readonly shortName$ = computed(() => this.domain$()?.key || '');

  protected readonly software$ = computed(() => {
    const d = this.domain$();
    if (!d)
      return [];

    return d.products
      .slice(0, 13)
      .map(p => ({
        name: p.name,
        image: `/assets/software/products/${d.key}/${p.name}.png`,
        link: `/software/${p.name}`
      }));
  });

  protected readonly customSoftwareLink$ = computed(() => `/software/custom/${this.shortName$()}`);
}
