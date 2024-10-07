import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { PaginatorComponent } from '@easworks/app-shell/common/paginator/paginator.component';
import { SnackbarComponent } from "@easworks/app-shell/notification/snackbar";
import { Domain } from "@easworks/models/domain";
import { Store } from '@ngrx/store';
import { domainData, featuredDomainActions, } from 'app-shell/state/domain-data';

@Component({
  standalone: true,
  selector: 'featured-domains-page',
  templateUrl: './featured-domains.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule,
    PaginatorComponent
  ]
})
export class FeaturedDomainsPageComponent {

  private readonly store = inject(Store);
  private readonly snackbar = inject(MatSnackBar);

  protected readonly trackBy = {
    domain: (_: number, d: Domain) => d.id,
  } as const;

  protected readonly domain = (() => {
    const list$ = this.store.selectSignal(domainData.selectors.domains.selectAll);
    const map$ = this.store.selectSignal(domainData.selectors.domains.selectEntities);

    return {
      list$,
      map$
    } as const;
  })();

  protected readonly software = (() => {
    const list$ = this.store.selectSignal(domainData.selectors.softwareProduct.selectAll);
    const map$ = this.store.selectSignal(domainData.selectors.softwareProduct.selectEntities);

    return {
      list$,
      map$
    } as const;
  })();

  protected readonly featuredDomains = (() => {
    const list$ = this.store.selectSignal(domainData.feature.selectFeaturedDomains);

    const hydrated$ = computed(() => {
      const data = {
        domains: this.domain.map$(),
        softwareProduct: this.software.map$()
      };

      const list = list$();

      return list.map(fd => {
        const domain = data.domains[fd.id];
        if (!domain)
          throw new Error(`invalid operation - domain '${fd.id}' cannot be found`);

        return {
          domain,
          roles: fd.roles,
          software: fd.software.map(s => {
            const software = data.softwareProduct[s];
            if (!software)
              throw new Error(`invalid operation - software product '${s}' cannot be found`);
            return software;
          })
        };
      });
    });

    const empty$ = computed(() => hydrated$().length === 0);

    return {
      list$,
      hydrated$,
      empty$
    } as const;
  })();

  readonly addDomain = {
    query$: signal<Domain | null>(null),
    options$: computed(() => {
      const all = this.domain.list$();

      const existingIds = new Set(this.featuredDomains.list$().map(fd => fd.id));

      return all.filter(d => !existingIds.has(d.id));
    }),
    click: (query: Domain | null) => {
      if (!query) {
        return;
      }
      this.store.dispatch(featuredDomainActions.add({ payload: { domain: query } }));
      SnackbarComponent.forSuccess(this.snackbar);
    }
  };

}