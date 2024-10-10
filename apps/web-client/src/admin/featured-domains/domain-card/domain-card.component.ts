import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, input } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { featuredDomainActions } from '@easworks/app-shell/state/domain-data';
import { FeaturedDomain } from '@easworks/models/featured';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { FeaturedDomainsPageComponent } from '../page/featured-domains.page';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admin-featured-domain-card',
  templateUrl: './domain-card.component.html',
  imports: [
    ImportsModule
  ]
})
export class AdminFeaturedDomainCardComponent {
  readonly page = inject(FeaturedDomainsPageComponent);
  readonly store = inject(Store);


  @HostBinding()
  private readonly class = 'rounded-md border';
  protected readonly icons = {
    faXmark,
  } as const;

  readonly domainInput$ = input.required<FeaturedDomain>({ alias: 'featuredDomain' });

  readonly featuredDomain$ = computed(() => {
    const map = this.page.domain.map$();

    const id = this.domainInput$().id;
    const domain = map[id];
    if (!domain)
      throw new Error(`invalid operation - could not find domain '${id}'`);
    return domain;
  });

  remove() {
    this.store.dispatch(featuredDomainActions.removeDomain({ payload: { domain: this.featuredDomain$().id } }));
  }
}