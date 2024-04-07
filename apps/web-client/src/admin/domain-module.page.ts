import { ChangeDetectionStrategy, Component, INJECTOR, computed, inject, signal } from "@angular/core";
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { faCheck, faRefresh, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { generateLoadingState } from "@easworks/app-shell/state/loading";
import { ADMIN_DATA_FEATURE, domainModuleActions } from "./state/admin-data";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SnackbarComponent } from "@easworks/app-shell/notification/snackbar";
import { SoftwareProduct } from "./models/tech-skill";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { map, shareReplay, startWith } from "rxjs";
import { SelectableOption } from "@easworks/app-shell/utilities/options";
import { controlValue$ } from "@easworks/app-shell/common/form-field.directive";
import { DomainModule } from "./models/domain";
import { EASRole } from "./models/eas-role";

@Component({
    standalone: true,
    selector: 'domain-module-page',
    templateUrl: './domain-module.page.html',
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
export class DomainModuleComponent {


    private readonly store = inject(Store);
    private readonly snackbar = inject(MatSnackBar);
    private readonly injector = inject(INJECTOR);

    protected readonly icons = {
        faCheck,
        faRefresh,
        faSquareXmark
    } as const;

    protected readonly loading = generateLoadingState<[
        'updating new domain module',
        'adding new domain module'
    ]>();


    private readonly domainModule$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectDomainModules);

    private readonly softwareProduct = {
        list$: this.store.selectSignal(ADMIN_DATA_FEATURE.selectSoftwareProducts),
    } as const;

    private readonly easRole = {
        list$: this.store.selectSignal(ADMIN_DATA_FEATURE.selectEasRoles),
    } as const;

    protected readonly table = this.initTable();

    private initTable() {

        const rowControls = () => {
            return {
                name: new FormControl('', { nonNullable: true, validators: [Validators.required] })
            };
        };

        const initAddDomainModule = () => {
            const form = new FormGroup({
                id: new FormControl('', {
                    nonNullable: true,
                    validators:
                        [
                            Validators.required,
                            ({ value }) => {
                                const list = this.domainModule$();
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

            //const isAddingGeneric$ = toSignal(controlValue$(form.controls.generic, true), { initialValue: false });

            const submitting$ = this.loading.has('adding new domain module');
            const submitDisabled$ = this.loading.any$;

            const submit = () => {
                if (!form.valid)
                    return;

                try {
                    this.loading.add('adding new domain module');
                    const value = form.getRawValue();


                    const payload: DomainModule = {
                        id: value.id,
                        name: value.name,
                        products: [],
                        roles: []
                    };
                    this.store.dispatch(domainModuleActions.add({ payload }));
                    form.reset({ name: "" });
                }

                catch (err) {
                    SnackbarComponent.forError(this.snackbar, err);
                }
                finally {
                    this.loading.delete('adding new domain module');
                }
            };

            // {
            //     const control = form.controls.softwareId;
            //     effect(() => {
            //         const isAddingGeneric = isAddingGeneric$();
            //         if (isAddingGeneric)
            //             control.disable();
            //         else
            //             control.enable();
            //     });
            // }

            return {
                form,
                submit,
                submitting$,
                submitDisabled$
            } as const;
        };


        const initUpdateDomainModule = () => {
            const injector = this.injector;

            const loading = generateLoadingState();
            this.loading.react('updating new domain module', loading.any$);

            const obs$ = toObservable(this.domainModule$)
                .pipe(
                    startWith(this.domainModule$()),
                    map((list) => {
                        const rows = list.map((dm) => {

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
                                    const selected = dm.products.map(id => map.get(id)!);

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
                                        this.store.dispatch(domainModuleActions.addProduct({
                                            payload: {
                                                group: dm.id,
                                                product: option.value.id
                                            }
                                        }));
                                    },
                                    removeProduct: (option: SelectableOption<SoftwareProduct>) => {
                                        this.store.dispatch(domainModuleActions.removeProduct({
                                            payload: {
                                                group: dm.id,
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

                            const initEasRoles = () => {
                                const query$ = signal<string | object>('');

                                // takes the list of skills and maps them into selectable options
                                const all$ = computed(() => {
                                    const easRoles = this.easRole.list$();
                                    //techGroups = techGroups.filter(x => x.generic === false);

                                    return easRoles.map<SelectableOption<EASRole>>(tg => ({
                                        value: tg,
                                        selected: false,
                                        label: tg.name
                                    }));
                                });

                                // takes the list of tech skill options 
                                // and puts them into Map, using id as the key
                                const allMap$ = computed(() => {
                                    return new Map(all$().map(option => [option.value.code, option]));
                                });

                                // takes the tech skills in the row's tech group
                                // then uses the map to locate the related option
                                // and creates a list of the selcted options
                                const selected$ = computed(() => {
                                    const map = allMap$();
                                    const selected = dm.roles.map(id => map.get(id)!);

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
                                    addRoles: (option: SelectableOption<EASRole>) => {
                                        if (option.selected)
                                            return;
                                        option.selected = true;
                                        this.store.dispatch(domainModuleActions.addRoles({
                                            payload: {
                                                group: dm.id,
                                                roles: option.value.code
                                            }
                                        }));
                                    },
                                    removeRoles: (option: SelectableOption<EASRole>) => {
                                        this.store.dispatch(domainModuleActions.removeRoles({
                                            payload: {
                                                group: dm.id,
                                                roles: option.value.code
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
                                return v.name !== dm.name;
                            });

                            const updating$ = loading.has(dm.id);

                            const disableButtons$ = computed(() =>
                                this.loading.any$() ||
                                !changed$()
                            );

                            const reset = () => {
                                form.reset({
                                    id: dm.id,
                                    name: dm.name
                                });
                            };

                            reset();

                            const update = async () => {
                                if (!form.valid)
                                    return;

                                try {
                                    loading.add(dm.id);

                                    const value = form.getRawValue();

                                    const payload: DomainModule = {
                                        id: dm.id,
                                        name: value.name,
                                        products: dm.products,
                                        roles: dm.roles
                                    };

                                    this.store.dispatch(domainModuleActions.update({ payload }));
                                }
                                catch (err) {
                                    SnackbarComponent.forError(this.snackbar, err);
                                }
                                finally {
                                    loading.delete(dm.id);
                                }
                            };

                            return {
                                data: dm,
                                sp: initSoftwareProduct(),
                                roles: initEasRoles(),
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
            add: initAddDomainModule(),
            rows$: initUpdateDomainModule()
        } as const;
    }
}
