import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatExpansionModule } from '@angular/material/expansion';
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { faCheck, faCircleCheck, faSquareXmark, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Store } from "@ngrx/store";
import { Domain } from './models/domain';
import { SoftwareProduct } from './models/tech-skill';
import { ADMIN_DATA_FEATURE, featuredProductActions } from "./state/admin-data";

@Component({
    standalone: true,
    selector: 'feature-product-page',
    templateUrl: './feature-product.page.html',
    //styleUrl: './tech-group.page.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ImportsModule,
        FormImportsModule,
        MatAutocompleteModule,
        MatExpansionModule,
        DragDropModule


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
        faTrashCan,
        faSquareXmark
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

        function initAdd(list: option[]) {
            const query$ = signal<string | option>('');

            const valid$ = computed(() => typeof query$() !== 'string');

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
            return {
                query$,
                valid$,
                options$: filtered$,
                displayFn,
                onChange
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

                const add = initAdd(optionList);

                const software = {
                    selected,
                    add: () => {
                        if (!add.valid$())
                            return;

                        const toAdd = add.query$() as option;

                        const ids = selected.map(o => o.value.id);
                        ids.push(toAdd.value.id);

                        software.update(ids);
                    },
                    remove: (idx: number) => {
                        const ids = selected.map(o => o.value.id);
                        ids.splice(idx, 1);
                        software.update(ids);
                    },
                    dropped: (event: CdkDragDrop<option>) => {
                        const ids = selected.map(o => o.value.id);
                        moveItemInArray(ids, event.previousIndex, event.currentIndex);
                        software.update(ids);
                    },
                    update: (ids: string[]) => {
                        this.store.dispatch(featuredProductActions.updateProducts({
                            payload: {
                                domain: domain.id,
                                software: ids
                            }
                        }));
                    }
                };

                return {
                    domain,
                    software,
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
