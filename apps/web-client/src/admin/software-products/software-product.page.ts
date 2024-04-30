import { ChangeDetectionStrategy, Component, INJECTOR, computed, inject, signal } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { faCheck, faRefresh, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { generateLoadingState } from "@easworks/app-shell/state/loading";
import { ADMIN_DATA_FEATURE, softwareProductActions } from "../state/admin-data";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { controlValue$ } from "@easworks/app-shell/common/form-field.directive";
import { SnackbarComponent } from "@easworks/app-shell/notification/snackbar";
import { SoftwareProduct, TechGroup } from "../models/tech-skill";
import { map, shareReplay, startWith } from "rxjs";
import { SelectableOption } from "@easworks/app-shell/utilities/options";

@Component({
  standalone: true,
  selector: 'software-product-page',
  templateUrl: './software-product.page.html',
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
export default class SoftwareProductPageComponent {

  private readonly store = inject(Store);
  private readonly snackbar = inject(MatSnackBar);
  private readonly injector = inject(INJECTOR);

  protected readonly icons = {
    faCheck,
    faRefresh,
    faSquareXmark
  } as const;

  protected readonly loading = generateLoadingState<[
    'updating new software product skill',
    'adding new software product skill'
  ]>();


  private readonly softwareProduct$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectSoftwareProducts);

  private readonly techGroup = {
    list$: this.store.selectSignal(ADMIN_DATA_FEATURE.selectTechGroups),
  } as const;

  protected readonly table = this.initTable();


  private initTable() {

    const rowControls = () => {
      return {
        name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        imageUrl: new FormControl('', { nonNullable: true }),
        //softwareId: new FormControl('', { nonNullable: true, validators: [] })
      };
    };

    const initAddSoftwareProduct = () => {
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
      }
      );

      //const isAddingGeneric$ = toSignal(controlValue$(form.controls.generic, true), { initialValue: false });

      const submitting$ = this.loading.has('adding new software product skill');
      const submitDisabled$ = this.loading.any$;

      const submit = () => {
        if (!form.valid)
          return;

        try {
          this.loading.add('adding new software product skill');
          const value = form.getRawValue();


          const payload: SoftwareProduct = {
            id: value.id,
            name: value.name,
            imageUrl: value.imageUrl,
            techGroup: []
          };
          this.store.dispatch(softwareProductActions.add({ payload }));
          form.reset({ imageUrl: '' });
        }

        catch (err) {
          SnackbarComponent.forError(this.snackbar, err);
        }
        finally {
          this.loading.delete('adding new software product skill');
        }
      };

      return {
        form,
        submit,
        submitting$,
        submitDisabled$
      } as const;
    };

    const initUpdateSoftwareProduct = () => {
      const injector = this.injector;

      const loading = generateLoadingState();
      this.loading.react('updating new software product skill', loading.any$);

      const obs$ = toObservable(this.softwareProduct$)
        .pipe(
          startWith(this.softwareProduct$()),
          map((list) => {
            const rows = list.map((sp) => {

              const initTechGroups = () => {
                const query$ = signal<string | object>('');

                // takes the list of skills and maps them into selectable options
                const all$ = computed(() => {
                  let techGroups = this.techGroup.list$();
                  techGroups = techGroups.filter(x => x.generic === false);

                  return techGroups.map<SelectableOption<TechGroup>>(tg => ({
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
                  const selected = sp.techGroup.map(id => map.get(id)!);

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
                  add: (option: SelectableOption<TechGroup>) => {
                    if (option.selected)
                      return;
                    option.selected = true;
                    this.store.dispatch(softwareProductActions.addTechgroup({
                      payload: {
                        softwareId: sp.id,
                        techgroup: option.value.id
                      }
                    }));
                  },
                  remove: (option: SelectableOption<TechGroup>) => {
                    this.store.dispatch(softwareProductActions.removeTechgroup({
                      payload: {
                        group: sp.id,
                        techgroup: option.value.id
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
                return v.name !== sp.name;
              });

              const updating$ = loading.has(sp.id);

              const disableButtons$ = computed(() =>
                this.loading.any$() ||
                !changed$()
              );

              const reset = () => {
                form.reset({
                  id: sp.id,
                  name: sp.name,
                  imageUrl: sp.imageUrl
                });
              };

              reset();

              const update = async () => {
                if (!form.valid)
                  return;

                try {
                  loading.add(sp.id);

                  const value = form.getRawValue();

                  const payload: SoftwareProduct = {
                    id: sp.id,
                    name: value.name,
                    imageUrl: value.imageUrl,
                    techGroup: sp.techGroup
                  };

                  this.store.dispatch(softwareProductActions.update({ payload }));
                }
                catch (err) {
                  SnackbarComponent.forError(this.snackbar, err);
                }
                finally {
                  loading.delete(sp.id);
                }
              };

              return {
                data: sp,
                techGroups: initTechGroups(),
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
      add: initAddSoftwareProduct(),
      rows$: initUpdateSoftwareProduct()
    } as const;

  }
}