import { ChangeDetectionStrategy, Component, INJECTOR, computed, inject } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { generateLoadingState } from "@easworks/app-shell/state/loading";
import { faCheck, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Store } from "@ngrx/store";
import { ADMIN_DATA_FEATURE, easActions } from "./state/admin-data";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SnackbarComponent } from "@easworks/app-shell/notification/snackbar";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { map, shareReplay, startWith } from "rxjs";
import { controlValue$ } from "@easworks/app-shell/common/form-field.directive";

@Component({
    standalone: true,
    selector: 'eas-role-page',
    templateUrl: './eas-role.page.html',
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
export class EasRoleComponent {

    private readonly store = inject(Store);
    private readonly snackbar = inject(MatSnackBar);
    private readonly injector = inject(INJECTOR);

    protected readonly icons = {
        faCheck,
        faRefresh
    } as const;

    protected readonly loading = generateLoadingState<[
        'updating new eas role',
        'adding new eas role'
    ]>();


    private readonly data$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectAdminDataState);
    private readonly list$ = computed(() => this.data$().easRole);

    protected readonly table = this.initTable();


    private initTable() {
        const rowControls = () => {
            return {
                name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            };
        };

        const initAddTechSkill = () => {
            const form = new FormGroup({
                code: new FormControl('', {
                    nonNullable: true,
                    validators:
                        [
                            Validators.required,
                            ({ value }) => {
                                const list = this.list$();
                                const exists = list.some(tech => tech.code === value);
                                if (exists)
                                    return { exists: true };
                                return null;
                            }
                        ],
                }),
                ...rowControls()
            }
            );

            const submitting$ = this.loading.has('adding new eas role');
            const submitDisabled$ = this.loading.any$;

            const submit = () => {
                if (!form.valid)
                    return;

                try {
                    this.loading.add('adding new eas role');
                    const value = form.getRawValue();

                    this.store.dispatch(easActions.add({ payload: value }));

                    form.reset();
                }
                catch (err) {
                    SnackbarComponent.forError(this.snackbar, err);
                }
                finally {
                    this.loading.delete('adding new eas role');
                }
            };

            return {
                form,
                submit,
                submitting$,
                submitDisabled$
            } as const;
        };

        const initUpdateTechSkill = () => {
            const injector = this.injector;

            const loading = generateLoadingState();
            this.loading.react('updating new eas role', loading.any$);

            const obs$ = toObservable(this.list$)
                .pipe(
                    startWith(this.list$()),
                    map((list) => {
                        const rows = list.map(ts => {
                            const form = new FormGroup({
                                code: new FormControl('', { nonNullable: true }),
                                ...rowControls()
                            });

                            const value$ = toSignal(
                                controlValue$(form),
                                { requireSync: true, injector });

                            const changed$ = computed(() => {
                                const v = value$();
                                return v.name !== ts.name;
                            });

                            const updating$ = loading.has(ts.code);

                            const disableButtons$ = computed(() =>
                                this.loading.any$() ||
                                !changed$()
                            );

                            const reset = () => {
                                form.reset({
                                    code: ts.code,
                                    name: ts.name
                                });
                            };

                            reset();

                            const update = async () => {
                                if (!form.valid)
                                    return;

                                try {
                                    loading.add(ts.code);

                                    const value = form.getRawValue();

                                    this.store.dispatch(easActions.update({
                                        payload: {
                                            code: ts.code,
                                            name: value.name
                                        }
                                    }));
                                }
                                catch (err) {
                                    SnackbarComponent.forError(this.snackbar, err);
                                }
                                finally {
                                    loading.delete(ts.code);
                                }
                            };

                            return {
                                data: ts,
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
            add: initAddTechSkill(),
            rows$: initUpdateTechSkill()
        } as const;
    }
}