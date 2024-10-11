import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, input, signal } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { featuredDomainActions } from '@easworks/app-shell/state/domain-data';
import { FeaturedDomain } from '@easworks/models/featured';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { FeaturedDomainsPageComponent } from '../page/featured-domains.page';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SoftwareProduct } from '@easworks/models/software';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admin-featured-domain-card',
  templateUrl: './domain-card.component.html',
  imports: [
    ImportsModule,
    FormImportsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule,
  ]
})
export class AdminFeaturedDomainCardComponent {
  readonly page = inject(FeaturedDomainsPageComponent);
  readonly store = inject(Store);

  private readonly snackbar = inject(MatSnackBar);

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

  readonly featuredRoles = (() => {
    const list$ = computed(() => {
      return this.domainInput$().roles;
    });

    const empty$ = computed(() => list$().length === 0);

    return {
      list$,
      empty$
    } as const;
  })();

  readonly addRole = (() => {
    const query$ = signal<string | null>(null);
    const disabled$ = computed(() => !query$());

    const options$ = computed(() => {
      const allRoles = this.featuredDomain$().roles;

      const existingRolesIds = new Set(this.domainInput$().roles);

      return allRoles.filter(d => !existingRolesIds.has(d));
    });

    const click = (query: string | null) => {
      if (!query) {
        return;
      }
      this.store.dispatch(featuredDomainActions.addRole({ payload: { domain: this.domainInput$().id, role: query } })); //Add role to Index
      query$.set("");
      SnackbarComponent.forSuccess(this.snackbar);
    };

    return {
      query$,
      disabled$,
      options$,
      click
    } as const;
  })();


  removeRole(role: string) {
    this.store.dispatch(featuredDomainActions.removeRole({ payload: { domain: this.domainInput$().id, role } }));
  }

  readonly featuredSoftwareProduct = (() => {
    const list$ = computed(() => {
      const allSoftware = this.page.software.list$();

      const allSoftwareRelateToFeatureDomain = new Set(this.featuredDomain$().products);

      const addedSoftwareInFeatureDomain = new Set(this.domainInput$().software);

      return allSoftware.filter(d => allSoftwareRelateToFeatureDomain.has(d.id) && addedSoftwareInFeatureDomain.has(d.id));
    });

    const empty$ = computed(() => list$().length === 0);

    return {
      list$,
      empty$
    } as const;
  })();

  readonly addSoftwareProduct = (() => {
    const query$ = signal<SoftwareProduct | null>(null);
    const disabled$ = computed(() => !query$());

    const options$ = computed(() => {
      const allSoftware = this.page.software.list$();

      const allSoftwareRelateToFeatureDomain = new Set(this.featuredDomain$().products);

      const addedSoftware = new Set(this.domainInput$().software);

      return allSoftware.filter(d => allSoftwareRelateToFeatureDomain.has(d.id) && !addedSoftware.has(d.id));
    });

    const click = (query: SoftwareProduct | null) => {
      if (!query) {
        return;
      }
      this.store.dispatch(featuredDomainActions.addSoftware({ payload: { domain: this.domainInput$().id, software: query.id } })); //Add role to Index
      query$.set(null);
      SnackbarComponent.forSuccess(this.snackbar);
    };

    return {
      query$,
      disabled$,
      options$,
      click
    } as const;
  })();


  removeSoftwareProduct(sp: SoftwareProduct) {
    this.store.dispatch(featuredDomainActions.removeSoftware({ payload: { domain: this.domainInput$().id, software: sp.id } }));
  }


}