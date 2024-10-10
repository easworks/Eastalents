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
import { AdminFeaturedDomainCardComponent } from '../domain-card/domain-card.component';

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
    PaginatorComponent,
    AdminFeaturedDomainCardComponent
  ]
})
export class FeaturedDomainsPageComponent {

  private readonly store = inject(Store);
  private readonly snackbar = inject(MatSnackBar);

  protected readonly trackBy = {
    domain: (_: number, d: Domain) => d.id,
  } as const;

  readonly domain = (() => {
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

    const empty$ = computed(() => list$().length === 0);

    return {
      list$,
      empty$
    } as const;
  })();

  readonly addDomain = (() => {
    const query$ = signal<Domain | null>(null);
    const disabled$ = computed(() => !query$());

    const options$ = computed(() => {
      const all = this.domain.list$();

      const existingIds = new Set(this.featuredDomains.list$().map(fd => fd.id));

      return all.filter(d => !existingIds.has(d.id));
    });

    const click = (query: Domain | null) => {
      if (!query) {
        return;
      }
      this.store.dispatch(featuredDomainActions.addDomain({ payload: { domain: query } }));
      SnackbarComponent.forSuccess(this.snackbar);
    };

    return {
      query$,
      disabled$,
      options$,
      click
    } as const;
  })();

}