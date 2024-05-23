import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from "@easworks/app-shell/state/loading";
import { faCheck, faRefresh, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import { SoftwareProduct } from '../models/tech-skill';
import { adminData, softwareProductActions } from '../state/admin-data';

@Component({
  standalone: true,
  selector: 'software-products-page',
  templateUrl: './software-products.page.html',
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
export class SoftwareProductsPageComponent {
  private readonly store = inject(Store);
  private readonly snackbar = inject(MatSnackBar);
  private readonly dRef = inject(DestroyRef);

  protected readonly icons = {
    faCheck,
    faRefresh,
    faXmark,
  } as const;

  protected readonly loading = generateLoadingState<[
    'updating software product',
    'adding software product'
  ]>();

  private readonly softwareProduct$ = this.store.selectSignal(adminData.selectors.softwareProduct.selectAll);

  protected readonly table = (() => {
    const rowControls = () => {
      return {
        name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        imageUrl: new FormControl('', { nonNullable: true }),
        //softwareId: new FormControl('', { nonNullable: true, validators: [] })
      };
    };

    const add = (() => {
      const form = new FormGroup({
        id: new FormControl('', {
          nonNullable: true,
          validators:
            [
              Validators.required,
              ({ value }) => {
                const list = this.softwareProduct$();
                const exists = list.some(group => group.id === value);
                if (exists)
                  return { exists: true };
                return null;
              }
            ],
        }),
        ...rowControls()
      });

      const status$ = toSignal(form.statusChanges, { initialValue: form.status });
      const valid$ = computed(() => status$() === 'VALID');

      const submitting$ = this.loading.has('adding software product');
      const submitDisabled$ = computed(() => this.loading.any$() || !valid$());

      const submit = () => {
        if (!form.valid)
          return;

        try {
          this.loading.add('adding software product');
          const value = form.getRawValue();

          const payload: SoftwareProduct = {
            id: value.id,
            name: value.name,
            imageUrl: value.imageUrl,
            techGroup: []
          };

          this.store.dispatch(softwareProductActions.add({ payload }));
          form.reset();
        }
        catch (err) {
          SnackbarComponent.forError(this.snackbar, err);
        }
        finally {
          this.loading.delete('adding software product');
        }
      };

      return {
        form,
        submit,
        submitting$,
        submitDisabled$
      } as const;
    })();

    const rows = (() => {

      const updating = generateLoadingState<string[]>();
      this.loading.react('updating software product', updating.any$);

      let rowSubs = new Subscription();
      this.dRef.onDestroy(() => rowSubs.unsubscribe());

      const $ = computed(() => {
        rowSubs.unsubscribe();
        rowSubs = new Subscription();

        return this.softwareProduct$().map(sp => {

          const form = new FormGroup({ ...rowControls() });

          const changeCheck = (value: typeof form['value']) =>
            value.name === sp.name &&
            value.imageUrl === sp.imageUrl;

          const valid$ = signal(form.status === 'VALID');
          const unchanged$ = signal(changeCheck(form.value));

          const disableButtons$ = computed(() => this.loading.any$() || unchanged$());

          const reset = {
            click: () => {
              form.reset({
                name: sp.name,
                imageUrl: sp.imageUrl
              });
            },
            disabled$: disableButtons$
          } as const;

          const submit = {
            click: () => {
              if (!form.valid)
                return;

              try {
                updating.add(sp.id);
                const value = form.getRawValue();
                const payload: SoftwareProduct = {
                  ...sp,
                  name: value.name,
                  imageUrl: value.imageUrl,
                };
                this.store.dispatch(softwareProductActions.update({ payload }));
              }
              finally {
                updating.delete(sp.id);
              }
            },
            disabled$: computed(() => disableButtons$() || !valid$()),
            loading$: updating.has(sp.id)
          } as const;


          rowSubs.add(form.statusChanges
            .pipe(map(s => s === 'VALID'))
            .subscribe(valid$.set),

          );
          rowSubs.add(form.valueChanges
            .pipe(map(changeCheck))
            .subscribe(unchanged$.set)
          );


          reset.click();

          return {
            data: sp,
            form,
            submit,
            reset,
          };
        });
      });

      return {
        $
      } as const;
    })();

    return {
      add,
      rows
    } as const;

  })();
}