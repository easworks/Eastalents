import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomainsApi } from '@easworks/app-shell/api/domains.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { DomainState } from '@easworks/app-shell/state/domains';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { fromPromise } from '@easworks/app-shell/utilities/to-promise';
import { SoftwareTilesContainerComponent } from '../common/software-tiles-container.component';

@Component({
  standalone: true,
  selector: 'easworks-talent-page',
  templateUrl: './easworks-talent.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    ImportsModule,
    SoftwareTilesContainerComponent
  ]
})
export class EasworksTalentPageComponent {
  private readonly api = {
    domains: inject(DomainsApi)
  } as const;
  private readonly domainState = inject(DomainState);

  private readonly loading = generateLoadingState<[
    'featured domains'
  ]>();

  protected readonly featuredDomains = this.initFeaturedDomains();

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
