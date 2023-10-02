import { ChangeDetectionStrategy, Component, HostBinding, computed, inject } from '@angular/core';
import { SoftwareTilesContainerComponent } from './software-tiles-container.component';
import { DomainsApi } from '@easworks/app-shell/api/domains.api';
import { fromPromise } from '@easworks/app-shell/utilities/to-promise';
import { DomainState } from '@easworks/app-shell/state/domains';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'featured-domains',
  templateUrl: './featured-domains.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    SoftwareTilesContainerComponent
  ]
})
export class FeaturedDomainsComponent {
  private readonly api = {
    domains: inject(DomainsApi)
  } as const;
  private readonly domainState = inject(DomainState);

  protected readonly featured = this.initFeaturedDomains();

  @HostBinding() private readonly class = 'grid gap-8';

  private initFeaturedDomains() {

    const list$ = fromPromise(this.api.domains.featuredDomains(), []);


    const featured$ = computed(() => {
      const list = list$();
      const domainMap = this.domainState.domains.map$();
      const productMap = this.domainState.products.map$();

      if (domainMap.size === 0 || productMap.size === 0)
        return [];

      const featured = list.map(l => {
        const domain = domainMap.get(l.domain);
        if (!domain)
          throw new Error(`module '${l.domain}' not fond`);

        const products = l.products
          .map(p => {
            const product = productMap.get(p);
            if (!product)
              throw new Error(`module '${l.domain}' has no product '${p}'`);
            return product;
          });

        return {
          ...domain,
          products
        } as const;
      });

      return featured;
    });

    const loading$ = computed(() => featured$().length === 0);

    return {
      domains$: featured$,
      loading$
    };
  }
}
