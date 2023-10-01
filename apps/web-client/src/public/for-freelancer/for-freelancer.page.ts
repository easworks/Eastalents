import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { DomainsApi } from '@easworks/app-shell/api/domains.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { HelpGroup } from '@easworks/app-shell/services/help';
import { DomainState } from '@easworks/app-shell/state/domains';
import { fromPromise } from '@easworks/app-shell/utilities/to-promise';
import { FAQGroup, FAQListComponent } from '../common/faq-list.component';
import { SoftwareTilesContainerComponent } from '../common/software-tiles-container.component';

@Component({
  standalone: true,
  selector: 'for-freelancer-page',
  templateUrl: './for-freelancer.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    MatExpansionModule,
    FAQListComponent,
    SoftwareTilesContainerComponent
  ]
})
export class ForFreelancerPageComponent {

  constructor() {
    const route = inject(ActivatedRoute);

    route.data.pipe(takeUntilDestroyed())
      .subscribe(d => {
        const helpGroups = d['help'] as HelpGroup[];
        this.faqs$.set(helpGroups.map(hg => ({
          name: hg.title,
          items: hg.items.map(i => ({
            question: i.title,
            content: i.content
          }))
        })));
      });
  }

  private readonly api = {
    domains: inject(DomainsApi)
  } as const;
  private readonly domainState = inject(DomainState);

  protected readonly featuredDomains = this.initFeaturedDomains();

  protected readonly faqs$ = signal<FAQGroup[]>([]);

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
