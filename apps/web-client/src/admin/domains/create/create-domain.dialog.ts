import { ChangeDetectionStrategy, Component, computed, inject, signal, untracked } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faQuestionCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse from 'fuse.js';
import { pattern } from 'models/pattern';
import { SoftwareProduct } from 'models/software';
import { domainActions, domainData, softwareProductActions } from 'app-shell/state/domain-data';
import { Domain } from 'models/domain';


interface CreateDomainDialogData {
    created: (id: string) => void;
}

@Component({
    standalone: true,
    selector: 'create-domain-dialog',
    templateUrl: './create-domain.dialog.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ImportsModule,
        MatDialogModule,
        FormImportsModule
    ]
})
export class CreateDomainDialogComponent {

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialogRef);
    private readonly snackbar = inject(MatSnackBar);
    private readonly data = inject<CreateDomainDialogData>(MAT_DIALOG_DATA);

    protected readonly icons = {
        faXmark,
        faQuestionCircle
    } as const;

    private readonly loading = generateLoadingState<[
        'creating domain'
    ]>();

    private readonly products = (() => {
        const list$ = this.store.selectSignal(domainData.selectors.domains.selectAll);
        const ids$ = computed(() => new Set(list$().map(skill => skill.id)));//to check
        const search$ = computed(() => new Fuse(list$(), {
            keys: ['name'],
            includeScore: true
        }));

        return {
            ids$,
            search$
        } as const;
    })();

    protected readonly formId = 'create-domain-form';

    protected readonly maxlength = {
        id: 64,
        longName: 64,
        shortName: 30
    } as const;

    private readonly validators = {
        id: (control: AbstractControl) => {
            const value = control.value as string;
            if (this.products.ids$().has(value))
                return { exists: true };

            return null;
        }
    } as const;


    protected readonly form = new FormGroup({
        id: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.pattern(pattern.slug),
                Validators.maxLength(this.maxlength.id),
                this.validators.id
            ]
        }),
        longName: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(this.maxlength.longName)
            ]
        }),
        shortName: new FormControl('', {
            nonNullable: true, validators: [
                Validators.required,
                Validators.maxLength(this.maxlength.shortName)
            ]
        }),
    }, { updateOn: 'submit' });


    protected readonly buttons = (() => {
        const disabled$ = this.loading.any$;

        const submit = {
            click: () => {
                if (!this.form.valid)
                    return;

                const value = this.form.getRawValue();

                const product: Domain = {
                    id: value.id,
                    longName: value.longName,
                    shortName: value.shortName,
                    modules: [],
                    services: [],
                    roles: [],
                    products: []
                };

                this.store.dispatch(domainActions.add({ payload: product })); // to check this with add
                SnackbarComponent.forSuccess(this.snackbar);
                this.data.created(product.id);
                this.dialog.close();
            },
            loading$: this.loading.has('creating domain')
        } as const;

        return {
            submit,
            disabled$
        } as const;
    })();

    protected readonly similarity = (() => {
        const input$ = signal('');

        const items$ = computed(() => {

            const input = input$();
            if (!input)
                return [];

            return untracked(this.products.search$).search(input)
                .map(result => result.item)
                .slice(0, 5);
        });

        const show$ = computed(() => items$().length > 0);

        return {
            input$,
            items$,
            show$
        } as const;
    })();

    protected reset() {
        this.similarity.input$.set('');
    }

    public static open(ref: MatDialogRef<DialogLoaderComponent>, data: CreateDomainDialogData) {
        DialogLoaderComponent.replace(ref, this, data);
    }
}