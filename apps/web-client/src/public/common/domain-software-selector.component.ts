import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Output, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DomainState } from '@easworks/app-shell/state/domains';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { Domain, SoftwareProduct } from '@easworks/models';

@Component({
  standalone: true,
  selector: 'domain-software-selector',
  templateUrl: './domain-software-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    MatRippleModule
  ]
})
export class DomainSoftwareSelectorComponent {

  constructor() {
    toPromise(this.domains$, l => l.length > 0)
      .then(l => this.selectedDomain$.set(l[0]));

    effect(() => {
      const selected = this.selectedDomain$();
      if (selected) {
        this.selectedProduct$.set(this.software$()[0]);
      }
    }, { allowSignalWrites: true });
  }

  private readonly domainState = inject(DomainState);

  @HostBinding() private readonly class = 'block';

  protected readonly trackBy = {
    domain: (_: number, d: Domain) => d.key,
    software: (_: number, s: SoftwareProduct) => s.name
  } as const;
  protected readonly domains$ = this.domainState.domains.list$;

  protected readonly selectedDomain$ = signal<Domain | null>(null);

  protected readonly software$ = computed(() => {
    const sd = this.selectedDomain$();
    if (sd)
      return sd.products;
    return this.domainState.products.list$();
  });

  protected readonly selectedProduct$ = signal<SoftwareProduct | null>(null);

  @Output() readonly selected = new EventEmitter<{
    domain: Domain;
    product: SoftwareProduct;
  }>();

  protected emitSelection() {
    const domain = this.selectedDomain$();
    const product = this.selectedProduct$();

    if (!domain || !product)
      throw new Error('invalid operation');

    this.selected.emit({
      domain,
      product
    });
  }
}
