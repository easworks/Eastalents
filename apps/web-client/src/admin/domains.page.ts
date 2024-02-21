import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { ChangeDetectionStrategy, Component, INJECTOR, computed, inject, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { MatSnackBar } from "@angular/material/snack-bar";
import { faCheck, faRefresh, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { generateLoadingState } from "@easworks/app-shell/state/loading";
import { ADMIN_DATA_FEATURE, domainActions } from "./state/admin-data";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Domain, DomainModule } from "./models/domain";
import { SnackbarComponent } from "@easworks/app-shell/notification/snackbar";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { map, shareReplay, startWith } from "rxjs";
import { SelectableOption } from "@easworks/app-shell/utilities/options";
import { SoftwareProduct } from "./models/tech-skill";
import { controlValue$ } from "@easworks/app-shell/common/form-field.directive";

@Component({
    standalone: true,
    selector: 'domains-page',
    templateUrl: './domains.page.html',
    //styleUrl: './tech-group.page.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ImportsModule,
        FormImportsModule,
        MatCheckboxModule,
        MatSelectModule,
        MatAutocompleteModule
    ]
})
export class DomainsComponent {
    private readonly store = inject(Store);
    private readonly snackbar = inject(MatSnackBar);
    private readonly injector = inject(INJECTOR);

    protected readonly icons = {
        faCheck,
        faRefresh,
        faSquareXmark
    } as const;

    protected readonly loading = generateLoadingState<[
        'updating new domains',
        'adding new domains'
    ]>();


    private readonly domains$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectDomains);

    private readonly softwareProduct = {
        list$: this.store.selectSignal(ADMIN_DATA_FEATURE.selectSoftwareProducts),
    } as const;

    private readonly domainModules = {
        list$: this.store.selectSignal(ADMIN_DATA_FEATURE.selectDomainModules),
    } as const;


    protected readonly table = this.initTable();

    private initTable() {

        const rowControls = () => {
            return {
                longName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
                prefix: new FormControl('', { validators: [Validators.required] }),
                shortName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
                services: new FormControl([], { nonNullable: true, validators: [Validators.required] }),
                disabled: new FormControl(false, { nonNullable: true, validators: [Validators.required] })
            };
        };

        const initAddDomains = () => {
            const form = new FormGroup({
                id: new FormControl('', {
                    nonNullable: true,
                    validators:
                        [
                            Validators.required,
                            ({ value }) => {
                                const list = this.domains$();
                                const exists = list.some(group => group.id === value);
                                if (exists)
                                    return { exists: true };
                                return null;
                            }
                        ],
                }),
                ...rowControls()
            }
            );


            const submitting$ = this.loading.has('adding new domains');
            const submitDisabled$ = this.loading.any$;

            const submit = () => {
                if (!form.valid)
                    return;

                try {
                    this.loading.add('adding new domains');
                    const value = form.getRawValue();


                    const payload: Domain = {
                        id: value.id,
                        longName: value.longName,
                        prefix: value.prefix,
                        shortName: value.shortName,
                        services: value.services,
                        disabled: value.disabled,
                        products: [],
                        modules: []

                    };
                    this.store.dispatch(domainActions.add({ payload }));
                    form.reset({ disabled: true });
                }

                catch (err) {
                    SnackbarComponent.forError(this.snackbar, err);
                }
                finally {
                    this.loading.delete('adding new domains');
                }
            };

            return {
                form,
                submit,
                submitting$,
                submitDisabled$
            } as const;
        };


        const initUpdateDomains = () => {
            const injector = this.injector;

            const loading = generateLoadingState();
            this.loading.react('updating new domains', loading.any$);

            const obs$ = toObservable(this.domains$)
                .pipe(
                    startWith(this.domains$()),
                    map((list) => {
                        const rows = list.map((domains) => {

                            const initSoftwareProduct = () => {
                                const query$ = signal<string | object>('');

                                // takes the list of skills and maps them into selectable options
                                const all$ = computed(() => {
                                    const softwareProducts = this.softwareProduct.list$();
                                    //techGroups = techGroups.filter(x => x.generic === false);

                                    return softwareProducts.map<SelectableOption<SoftwareProduct>>(tg => ({
                                        value: tg,
                                        selected: false,
                                        label: tg.name
                                    }));
                                });

                                // takes the list of tech skill options 
                                // and puts them into Map, using id as the key
                                const allMap$ = computed(() => {
                                    return new Map(all$().map(option => [option.value.id, option]));
                                });

                                // takes the tech skills in the row's tech group
                                // then uses the map to locate the related option
                                // and creates a list of the selcted options
                                const selected$ = computed(() => {
                                    const map = allMap$();
                                    const selected = domains.products.map(id => map.get(id)!);

                                    selected.forEach(option => option.selected = true);
                                    return selected;
                                });
                                const count$ = computed(() => selected$().length);


                                // filters the suggested tech skills
                                // if an item is selected, it should not be in the sugestions
                                // if an item is matching the query, it should be in suggestions
                                const filtered$ = computed(() => {
                                    const q = query$();
                                    const all = all$();

                                    const filter = typeof q === 'string' &&
                                        q.trim().toLowerCase();

                                    const filtered = all
                                        .filter(option => !option.selected &&
                                            (!filter || option.value.name.toLowerCase().includes(filter)));

                                    return filtered;
                                });

                                // simple handlers
                                const handlers = {
                                    addProduct: (option: SelectableOption<SoftwareProduct>) => {
                                        if (option.selected)
                                            return;
                                        option.selected = true;
                                        this.store.dispatch(domainActions.addProduct({
                                            payload: {
                                                group: domains.id,
                                                product: option.value.id
                                            }
                                        }));
                                    },
                                    removeProduct: (option: SelectableOption<SoftwareProduct>) => {
                                        this.store.dispatch(domainActions.removeProduct({
                                            payload: {
                                                group: domains.id,
                                                product: option.value.id
                                            }
                                        }));
                                    }
                                } as const;

                                // export the tech section of the row
                                return {
                                    query$,
                                    filtered$,
                                    selected: {
                                        $: selected$,
                                        count$
                                    },
                                    ...handlers
                                } as const;
                            };

                            const initDomainModules = () => {
                                const query$ = signal<string | object>('');

                                // takes the list of skills and maps them into selectable options
                                const all$ = computed(() => {
                                    const domainModules = this.domainModules.list$();
                                    //techGroups = techGroups.filter(x => x.generic === false);

                                    return domainModules.map<SelectableOption<DomainModule>>(tg => ({
                                        value: tg,
                                        selected: false,
                                        label: tg.name
                                    }));
                                });

                                // takes the list of tech skill options 
                                // and puts them into Map, using id as the key
                                const allMap$ = computed(() => {
                                    return new Map(all$().map(option => [option.value.id, option]));
                                });

                                // takes the tech skills in the row's tech group
                                // then uses the map to locate the related option
                                // and creates a list of the selcted options
                                const selected$ = computed(() => {
                                    const map = allMap$();
                                    const selected = domains.modules.map(id => map.get(id)!);

                                    selected.forEach(option => option.selected = true);
                                    return selected;
                                });
                                const count$ = computed(() => selected$().length);


                                // filters the suggested tech skills
                                // if an item is selected, it should not be in the sugestions
                                // if an item is matching the query, it should be in suggestions
                                const filtered$ = computed(() => {
                                    const q = query$();
                                    const all = all$();

                                    const filter = typeof q === 'string' &&
                                        q.trim().toLowerCase();

                                    const filtered = all
                                        .filter(option => !option.selected &&
                                            (!filter || option.value.name.toLowerCase().includes(filter)));

                                    return filtered;
                                });

                                // simple handlers
                                const handlers = {
                                    addDomainModule: (option: SelectableOption<DomainModule>) => {
                                        if (option.selected)
                                            return;
                                        option.selected = true;
                                        this.store.dispatch(domainActions.addModules({
                                            payload: {
                                                group: domains.id,
                                                module: option.value.id
                                            }
                                        }));
                                    },
                                    removeDomainModule: (option: SelectableOption<DomainModule>) => {
                                        this.store.dispatch(domainActions.removeModules({
                                            payload: {
                                                group: domains.id,
                                                module: option.value.id
                                            }
                                        }));
                                    }
                                } as const;

                                // export the tech section of the row
                                return {
                                    query$,
                                    filtered$,
                                    selected: {
                                        $: selected$,
                                        count$
                                    },
                                    ...handlers
                                } as const;
                            };

                            const form = new FormGroup({
                                id: new FormControl('', { nonNullable: true }),
                                ...rowControls()
                            });

                            const value$ = toSignal(
                                controlValue$(form),
                                { requireSync: true, injector });

                            const changed$ = computed(() => {
                                const v = value$();
                                return v.id !== domains.id;
                            });

                            const updating$ = loading.has(domains.id);

                            const disableButtons$ = computed(() =>
                                this.loading.any$() ||
                                !changed$()
                            );

                            const reset = () => {
                                form.reset({
                                    id: domains.id,
                                    longName: domains.longName,
                                    //services:domains.services,
                                    shortName: domains.shortName,
                                    disabled: domains.disabled,
                                    prefix: domains.prefix
                                });
                            };

                            reset();

                            const update = async () => {
                                if (!form.valid)
                                    return;

                                try {
                                    loading.add(domains.id);

                                    const value = form.getRawValue();

                                    const payload: Domain = {
                                        id: domains.id,
                                        longName: value.longName,
                                        shortName: value.shortName,
                                        disabled: value.disabled,
                                        prefix: value.prefix,
                                        services: value.services,
                                        products: domains.products,
                                        modules: domains.modules
                                    };

                                    this.store.dispatch(domainActions.update({ payload }));
                                }
                                catch (err) {
                                    SnackbarComponent.forError(this.snackbar, err);
                                }
                                finally {
                                    loading.delete(domains.id);
                                }
                            };

                            return {
                                data: domains,
                                sp: initSoftwareProduct(),
                                dm: initDomainModules(),
                                form,
                                reset,
                                update,
                                updating$,
                                disableButtons$
                            } as const;
                        });

                        return rows;
                    }),
                    takeUntilDestroyed(),
                    shareReplay({ refCount: true, bufferSize: 1 })
                );

            return toSignal(obs$, { requireSync: true });
        };






        return {
            add: initAddDomains(),
            rows$: initUpdateDomains()
        } as const;
    }
}