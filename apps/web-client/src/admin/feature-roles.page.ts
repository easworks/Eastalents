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
import { ADMIN_DATA_FEATURE, featuredRolesActions } from "./state/admin-data";
import { EASRole } from './models/eas-role';

@Component({
    standalone: true,
    selector: 'feature-roles-page',
    templateUrl: './feature-roles.page.html',
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



export class FeatureRolesComponent {
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
        type option = SelectableOption<EASRole>;

        const featured$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectFeaturedRoles);
        const domainMap$ = this.store.selectSignal(ADMIN_DATA_FEATURE.domainMap);
        const domainModuleMap$ = this.store.selectSignal(ADMIN_DATA_FEATURE.domainModuleMap);
        const easRoleMap$ = this.store.selectSignal(ADMIN_DATA_FEATURE.easRoleMap);

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
            const allDomainModuleMap = domainModuleMap$();
            const allEasRoleMap = easRoleMap$();

            const mapped = featured.map(f => {
                const domain = domains.get(f.domain)!;

                const selectedIds = new Set(f.roles);

                const data: string[] = [];
                domain.modules.forEach(x => {
                    const domainModule = allDomainModuleMap.get(x);
                    if (data.findIndex(y => y === x) === -1 && domainModule != undefined) {
                        domainModule.roles.forEach(role => {
                            if (data.findIndex(y => y === role) === -1) {
                                data.push(role);
                            }
                        });
                    }
                });

                const optionList = data.map<option>(id => {
                    const easRole = allEasRoleMap.get(id)!;

                    return {
                        value: easRole,
                        selected: selectedIds.has(easRole.code),
                        label: easRole.name
                    };
                });

                const optionMap = optionList.reduce((state, current) => {
                    state[current.value.code] = current;
                    return state;
                }, {} as Record<string, option>);

                const selected = f.roles.map(id => optionMap[id]);

                const add = initAdd(optionList);

                const easrole = {
                    selected,
                    add: () => {
                        if (!add.valid$())
                            return;

                        const toAdd = add.query$() as option;

                        const ids = selected.map(o => o.value.code);
                        ids.push(toAdd.value.code);

                        easrole.update(ids);
                    },
                    remove: (idx: number) => {
                        const ids = selected.map(o => o.value.code);
                        ids.splice(idx, 1);
                        easrole.update(ids);
                    },
                    dropped: (event: CdkDragDrop<option>) => {
                        const ids = selected.map(o => o.value.code);
                        moveItemInArray(ids, event.previousIndex, event.currentIndex);
                        easrole.update(ids);
                    },
                    update: (ids: string[]) => {
                        this.store.dispatch(featuredRolesActions.updateRoles({
                            payload: {
                                domain: domain.id,
                                software: ids
                            }
                        }));
                    }
                };

                return {
                    domain,
                    easrole,
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
            this.store.dispatch(featuredRolesActions.addDomain({
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
            this.store.dispatch(featuredRolesActions.removeDomain({
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