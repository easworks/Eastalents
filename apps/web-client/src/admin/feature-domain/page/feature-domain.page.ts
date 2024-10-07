import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { PaginatorComponent } from '@easworks/app-shell/common/paginator/paginator.component';
import { Store } from '@ngrx/store';
import { domainData, featureDomainActions } from 'app-shell/state/domain-data';
import { Domain } from "@easworks/models/domain";
import { FeaturedDomain } from "@easworks/models/featured";
import { SnackbarComponent } from "@easworks/app-shell/notification/snackbar";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    standalone: true,
    selector: 'feature-domain-page',
    templateUrl: './feature-domain.page.html',
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
export class FeatureDomainPageComponent {


    private readonly store = inject(Store);
    private readonly snackbar = inject(MatSnackBar);

    protected readonly trackBy = {
        domain: (_: number, d: Domain) => d.id,
    } as const;

    protected readonly domain = (() => {
        const list$ = this.store.selectSignal(domainData.selectors.domains.selectAll);

        return {
            list$
        } as const;
    })();

    protected readonly featuredDomains = (() => { //Change it to feature domain
        const list$ = this.store.selectSignal(domainData.feature.selectFeaturedDomains);

        return {
            list$
        } as const;
    })();


    // protected readonly listOfFeatureDomainData = (() => {
    //     const rows = (() => {
    //         const $ = computed(() => {

    //             return this.featuredDomains.list$().map(featureDomain => {
    //                 const findDomain = this.domain.list$().find(domain => domain.id === featureDomain.domain);
    //                 let domainLongName = '';
    //                 if (findDomain) {
    //                     domainLongName = findDomain.longName;
    //                 }

    //                 return {
    //                     data: featureDomain,
    //                     domainLongName: domainLongName
    //                 };
    //             });
    //         });

    //         return {
    //             $
    //         } as const;
    //     })();

    //     const empty$ = computed(() => rows.$().length === 0);

    //     return {
    //         rows,
    //         empty$,
    //     } as const;
    // })();




    readonly addDomain = {
        query$: signal<Domain | null>(null),
        options$: computed(() => {
            const all = this.domain.list$();

            const existingIds = new Set(this.featuredDomains.list$().map(fd => fd.domain));

            return all.filter(d => !existingIds.has(d.id));
        }),
        click: (query: Domain | null) => {
            if (!query) {
                return;
            }

            const featureDomain: FeaturedDomain = {
                domain: query.id,
                roles: query.roles,
                software: query.products
            };
            //this.store.dispatch(featureDomainActions.add({ payload: featureDomain })); // to check this with add
            SnackbarComponent.forSuccess(this.snackbar);
        }
    };

}