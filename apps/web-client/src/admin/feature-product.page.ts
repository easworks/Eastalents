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
import { ADMIN_DATA_FEATURE, featuredProductActions } from "./state/admin-data";


import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { faCheck, faCircleCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Domain } from './models/domain';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { SoftwareProduct } from './models/tech-skill';

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

    private readonly allDomains$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectDomains);

    protected readonly featured = this.initFeatured();
    protected readonly domains = this.initDomains();

    protected readonly icons = {
        faCheck,
        faCircleCheck,
        faTrashCan
    } as const;


    private initFeatured() {
        type option = SelectableOption<SoftwareProduct>;

        const featured$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectFeaturedProducts);
        const domainMap$ = this.store.selectSignal(ADMIN_DATA_FEATURE.domainMap);
        const softwareMap$ = this.store.selectSignal(ADMIN_DATA_FEATURE.softwareMap);

        const ids$ = computed(() => new Set(featured$().map(d => d.domain)));

        const displayFn = (v: string | option | null) => {
            if (!v) return '';

            if (typeof v === 'string') return v;
            return v.value.name;
        };

        function initAdd(list: option[], map: Record<string, option>) {
            const query$ = signal<string | option>('');

            const isValid$ = computed(() => typeof query$() !== 'string');

            const filtered$ = computed(() => {
                const q = query$();

                if (typeof q === 'string') {
                    const filter = q.trim().toLowerCase();
                    return list.filter(option =>
                        !option.selected &&
                        (!filter || option.label?.toLowerCase().includes(filter)));
                }
                else {
                    return [q];
                }
            });

            const onChange = (value: string | option) => {
                if (typeof value === 'string') {
                    const filtered = filtered$();
                    if (filtered.length) {
                        const opt = filtered[0];
                        const isSame = value.toLowerCase() === opt.value.name.toLowerCase();
                        if (isSame) {
                            value = opt;
                        }
                    }
                }

                query$.set(value);
            };

            const appendToList = () => {
                if (!isValid$())
                    return;

                const value = query$();

                console.debug(value);

            };

            return {
                query$,
                isValid$,
                options$: filtered$,
                displayFn,
                onChange,
                appendToList
            } as const;
        }

        const mapped$ = computed(() => {
            const featured = featured$();
            const domains = domainMap$();
            const allSoftware = softwareMap$();



            const mapped = featured.map(f => {
                const domain = domains.get(f.domain)!;

                const selectedIds = new Set(f.software);

                const optionList = domain?.products.map<option>(id => {
                    const product = allSoftware.get(id)!;

                    return {
                        value: product,
                        selected: selectedIds.has(product.id),
                        label: product.name
                    };

                });

                const optionMap = optionList.reduce((state, current) => {
                    state[current.value.id] = current;
                    return state;
                }, {} as Record<string, option>);

                const selected = f.software.map(id => optionMap[id]);

                const add = initAdd(optionList, optionMap);

                return {
                    domain,
                    selected,
                    add
                };
            });

            return mapped;
        });



        return {
            mapped$,
            ids$
        } as const;
    }

    private initDomains() {
        const available$ = computed(() => {
            const domains = this.allDomains$();
            const featuredIds = this.featured.ids$();

            return domains.filter(domain => !featuredIds.has(domain.id));
        });

        const query$ = signal<string | Domain>('');
        const valid$ = computed(() => typeof query$() !== 'string');

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

        const onChange = (value: string | Domain) => {
            if (typeof value === 'string') {
                const filtered = filtered$();
                if (filtered.length) {
                    const opt = filtered[0];
                    const isSame = value.toLowerCase() === opt.longName.toLowerCase();
                    if (isSame) {
                        value = opt;
                    }
                }
            }

            query$.set(value);
        };

        const submit = () => {
            if (!valid$())
                return;
            const selected = query$() as Domain;
            if (!selected)
                return;
            this.store.dispatch(featuredProductActions.addDomain({
                payload: {
                    domain: selected.id,
                }
            }));
            query$.set('');
        };

        const displayFn = (value: string | Domain | null) => {
            if (!value) return '';

            if (typeof value === 'string') return value;

            return value.longName;
        };

        const remove = (domain: Domain) => {
            this.store.dispatch(featuredProductActions.removeDomain({
                payload: {
                    domain: domain.id
                }
            }));
        };


        return {
            query$,
            filtered$,
            valid$,
            submit,
            onChange,
            remove,
            displayFn
        } as const;
    }
}
