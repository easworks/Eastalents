import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { Store } from "@ngrx/store";
import { FeaturedProductDomain } from "./models/featured";
import { ADMIN_DATA_FEATURE } from "./state/admin-data";


import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Domain } from './models/domain';

@Component({
    standalone: true,
    selector: 'feature-product-page',
    templateUrl: './feature-product.page.html',
    //styleUrl: './tech-group.page.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ImportsModule,
        FormImportsModule,
        MatCheckboxModule,
        MatSelectModule,
        MatAutocompleteModule,

        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,

        MatFormFieldModule,

        MatChipsModule, CdkDropList, CdkDrag
    ]
})



export class FeatureProductComponent {
    private readonly store = inject(Store);

    protected readonly featured = this.initFeatured();
    protected readonly domains = this.initDomains();

    protected readonly icons = {
        faCheck
    } as const;


    private initFeatured() {
        const domains$ = signal([] as FeaturedProductDomain[]);
        const ids$ = computed(() => {
            return new Set(domains$().map(d => d.domain));
        });
        return {
            domains$,
            ids$
        } as const;
    }

    private initDomains() {
        const domains$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectDomains);

        const selected$ = signal<Domain | null>(null);
        const empty$ = computed(() => !selected$());

        const available$ = computed(() => {
            const domains = domains$();
            const featuredIds = this.featured.ids$();

            return domains.filter(domain => !featuredIds.has(domain.id));
        });

        const query$ = signal<string | Domain>('');

        const filtered$ = computed(() => {
            const q = query$();
            const available = available$();

            if (typeof q === 'string') {
                const filter = q.trim().toLowerCase();
                return available
                    .filter(domain => !filter || domain.longName.toLowerCase().includes(filter));
            }
            else {
                return [q];
            }
        });

        effect(() => {
            const q = query$();
            if (typeof q === 'string') {
                const filtered = filtered$();
                if (filtered.length === 1) {
                    const domain = filtered[0];
                    const isSame = q.toLowerCase() === domain.longName.toLowerCase();
                    if (isSame) {
                        query$.set(domain);
                    }

                }
            }
            else {
                selected$.set(q);
            }
        }, { allowSignalWrites: true });

        const submit = () => {
            console.debug('selected', selected$());
        };

        const displayFn = (value: string | Domain | null) => {
            if (!value) return '';

            if (typeof value === 'string') return value;

            return value.longName;
        };

        return {
            query$,
            filtered$,
            empty$,
            submit,
            displayFn
        } as const;
    }
}
