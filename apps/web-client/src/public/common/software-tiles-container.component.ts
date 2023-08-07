import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Domain } from '@easworks/models';

type DomainPartial = Pick<Domain, 'key' | 'longName' | 'products'>;

@Component({
  standalone: true,
  selector: 'software-tiles-container',
  templateUrl: './software-tiles-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SoftwareTilesContainerComponent {
  @Input({ required: true }) set domain(domain: DomainPartial) {
    this.domain$.set(domain);
  };

  private readonly domain$ = signal<DomainPartial | null>(null);

  protected readonly label$ = computed(() => {
    const d = this.domain$();
    console.debug(d);
    return d ? `${d.key} - ${d.longName}` : '';
  });

  private readonly selected$ = computed(() => this.domain$()?.products.slice(0, 10) || []);
  protected readonly software$ = computed(() => this.selected$().map(s => ({
    text: s.name,
    link: `/software/${s.name}`
  })));
}
