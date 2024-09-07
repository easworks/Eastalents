import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClearTriggerOnSelectDirective } from '@easworks/app-shell/common/clear-trigger-on-select.directive';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { faSquareXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { domainData, softwareProductActions } from 'app-shell/state/domain-data';
import Fuse from 'fuse.js';
import { TechGroup, TechSkill } from 'models/software';
import { Subscription } from 'rxjs';

interface DomainModulesDialogData {
    domainId: string;
}

@Component({
    standalone: true,
    selector: 'domain-modules-dialog',
    templateUrl: './domain-modules.dialog.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ImportsModule,
        MatDialogModule,
        FormImportsModule,
        MatAutocompleteModule,
        ClearTriggerOnSelectDirective
    ]
})
export class DomainModulesDialogComponent implements OnInit {

    private readonly store = inject(Store);
    private readonly data = inject<DomainModulesDialogData>(MAT_DIALOG_DATA);
    private readonly dRef = inject(DestroyRef);

    protected readonly icons = {
        faXmark,
        faSquareXmark
    } as const;

    protected readonly loading = generateLoadingState<[]>();


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

        const changes = generateLoadingState<string[]>();

        const original$ = computed(() => new Set(this.domain$().modules));

        const current$ = signal(this.domain$().modules);

        const rowControls = () => {
            return {
                name: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required]
                })
            };
        };

        const rows = (() => {
            let rowSubs = new Subscription();
            this.dRef.onDestroy(() => rowSubs.unsubscribe());

            const $ = computed(() => {
                rowSubs.unsubscribe();
                rowSubs = new Subscription();

                return current$().map(module => {
                    const form = new FormGroup(rowControls());

                    const changeCheck = (value: typeof form['value']) =>
                        value.name === module;

                    const unchanged$ = signal(changeCheck(form.value));

                    const disableButtons$ = computed(() => this.loading.any$() || unchanged$());

                    const reset = {
                        click: () => {
                            form.reset({
                                name: module,
                            });
                        },
                        disabled$: disableButtons$
                    } as const;


                });


            });

            return {
                $
            } as const;
        })();

        const empty$ = computed(() => rows.$.length === 0);

        const computeChanges = (module: string) => {
            const original = original$();
            if (original.has(module))
                changes.add(module);
            else
                changes.delete(module);
        };

        // const remove = (module: string) => {
        //     rows$.update(rows => rows.filter(r => r !== module));
        //     computeChanges(module);
        // };

        // const add = (() => {
        //     const input$ = signal('');

        //     const searchable$ = rows$;

        //     const search$ = computed(() => new Fuse(searchable$(), { includeScore: true, }));

        //     const similarity = (() => {

        //         const items$ = computed(() => {

        //             const input = input$();
        //             if (!input)
        //                 return [];

        //             return untracked(search$).search(input)
        //                 .map(result => result.item)
        //                 .slice(0, 5);
        //         });

        //         const show$ = computed(() => items$().length > 0);

        //         return {
        //             items$,
        //             show$
        //         } as const;
        //     })();

        //     const click = (module: string) => {
        //         rows$.update(rows => {
        //             rows.push(module);
        //             rows.sort();
        //             return [...rows];
        //         });
        //         computeChanges(module);
        //     };

        //     return {
        //         input$,
        //         similarity,
        //         click
        //     } as const;
        // })();

        return {
            // rows$,
            empty$,
            changes,
            // add,
            // remove
        } as const;
    })();



    protected readonly buttons = (() => {
        const save = (() => {
            const disabled$ = computed(() => true);

            const click = () => {
                // const value: SoftwareProduct['domains'] = this.table.rows$()
                //     .map(row => row.id);

                // this.store.dispatch(softwareProductActions.updateDomains({
                //     payload: {
                //         id: this.product$().id,
                //         domains: value
                //     }
                // }));

                // this.table.changes.clear();
            };

            return {
                disabled$,
                click
            } as const;

        })();

        const reset = (() => {

            const click = () => {
                // const domains = this.domains.map$();
                // const product = this.product$();
                // const value = product.domains.map(id => ({
                //     id,
                //     name: domains[id]?.longName || ''
                // }));

                // this.table.rows$.set(value);
                // this.table.changes.clear();
                // this.table.add.query$.set('');
            };

            return { click } as const;
        })();

        return { save, reset } as const;
    })();

    public static open(ref: MatDialogRef<DialogLoaderComponent>, data: DomainModulesDialogData) {
        DialogLoaderComponent.replace(ref, this, data);
        ref.addPanelClass('w-80');
    }

    ngOnInit() {
        this.buttons.reset.click();
    }

}