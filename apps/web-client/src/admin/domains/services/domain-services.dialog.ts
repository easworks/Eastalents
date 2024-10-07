import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClearTriggerOnSelectDirective } from '@easworks/app-shell/common/clear-trigger-on-select.directive';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { controlStatus$, controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faAdd, faRemove, faSquareXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { domainActions, domainData } from 'app-shell/state/domain-data';

interface DomainServicesDialogData {
    domainId: string;
}

@Component({
    standalone: true,
    selector: 'domain-services-dialog',
    templateUrl: './domain-services.dialog.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ImportsModule,
        MatDialogModule,
        FormImportsModule,
        MatAutocompleteModule,
        ClearTriggerOnSelectDirective
    ]
})
export class DomainServicesDialogComponent {


    private readonly store = inject(Store);
    private readonly data = inject<DomainServicesDialogData>(MAT_DIALOG_DATA);
    private readonly snackbar = inject(MatSnackBar);

    protected readonly icons = {
        faXmark,
        faSquareXmark,
        faRemove,
        faAdd
    } as const;

    protected readonly loading = generateLoadingState<[
        'saving domain services'
    ]>();


    protected readonly domain$ = (() => {
        const map$ = this.store.selectSignal(domainData.selectors.domains.selectEntities);

        return computed(() => {
            const domain = map$()[this.data.domainId];
            if (!domain)
                throw new Error('invalid operation');
            return domain;
        });
    })();


    protected readonly table = (() => {

        const rowControl = (initial = '') => {
            return new FormControl(initial, {
                nonNullable: true,
                validators: [Validators.required]
            });
        };

        const controls = this.domain$().services.map(service => rowControl(service));

        const form = new FormArray(controls);

        const value$ = toSignal(controlValue$(form), { requireSync: true });
        const status$ = toSignal(controlStatus$(form), { requireSync: true });

        // check for duplicates
        effect(() => {
            const value = value$();

            const present = new Set<string>();
            const duplicates = new Set<string>();

            for (const item of value) {
                if (!item)
                    continue;
                const toCheck = item.toLowerCase();
                if (present.has(toCheck))
                    duplicates.add(toCheck);
                else
                    present.add(toCheck);
            }

            form.controls.forEach(control => {
                const toCheck = control.value.toLowerCase();
                if (duplicates.has(toCheck)) {
                    control.markAsDirty({ emitEvent: false });
                    control.setErrors({ duplicate: true });
                }
                else {
                    const keys = control.errors && Object.keys(control.errors) || [];
                    if (keys.length === 1 && keys[0] === 'duplicate')
                        control.updateValueAndValidity();
                }
            });

        });

        const empty$ = computed(() => {
            const v = value$();
            return !v || v.length === 0;
        });

        const add = () => {
            form.push(rowControl());
        };

        const remove = (idx: number) => {
            form.removeAt(idx);
        };

        const changed$ = computed(() => {
            const original = this.domain$().services;
            const value = value$();

            return value.length !== original.length ||
                value.some((v, i) => original[i] !== v);
        });

        const reset = () => {
            form.clear({ emitEvent: false });
            this.domain$().services.forEach(service => form.push(rowControl(service), { emitEvent: false }));
            form.updateValueAndValidity();
        };

        return {
            form,
            empty$,
            add,
            remove,
            changed$,
            reset,
            status$
        } as const;
    })();


    protected readonly buttons = (() => {
        const save = (() => {
            const disabled$ = computed(() => !this.table.changed$() || this.table.status$() !== 'VALID' || this.loading.any$());
            const loading$ = this.loading.has('saving domain services');

            const click = () => {
                const form = this.table.form;
                if (!form.valid)
                    return;

                let value = form.value;
                value = value.map(v => v.trim());
                value = value.filter(v => !!v);
                value.sort();

                this.store.dispatch(domainActions.updateServices({
                    payload: {
                        id: this.domain$().id,
                        services: value
                    }
                }));
                SnackbarComponent.forSuccess(this.snackbar);

                this.table.reset();
            };

            return {
                disabled$,
                loading$,
                click
            } as const;

        })();

        const reset = (() => {

            const click = () => {
                this.table.reset();
            };

            return { click } as const;
        })();

        return { save, reset } as const;
    })();

    public static open(ref: MatDialogRef<DialogLoaderComponent>, data: DomainServicesDialogData) {
        DialogLoaderComponent.replace(ref, this, data);
        ref.addPanelClass('w-80');
    }
}