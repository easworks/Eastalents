import { ChangeDetectionStrategy, Component, INJECTOR, computed, effect, inject, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { controlValue$ } from "@easworks/app-shell/common/form-field.directive";
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { SnackbarComponent } from "@easworks/app-shell/notification/snackbar";
import { generateLoadingState } from "@easworks/app-shell/state/loading";
import { SelectableOption } from "@easworks/app-shell/utilities/options";
import { faCheck, faRefresh, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { Store } from "@ngrx/store";
import { map, shareReplay, startWith } from "rxjs";
import { GenericTechGroup, NonGenericTechGroup, TechGroup, TechSkill } from "./models/tech-skill";
import { ADMIN_DATA_FEATURE, techGroupActions } from "./state/admin-data";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@Component({
  standalone: true,
  selector: 'admin-tech-group-page',
  templateUrl: './tech-group.page.html',
  styleUrl: './tech-group.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule
  ]
})
export class TechGroupPageComponent {

  private readonly store = inject(Store);
  private readonly snackbar = inject(MatSnackBar);
  private readonly injector = inject(INJECTOR);

  protected readonly icons = {
    faCheck,
    faRefresh,
    faSquareXmark
  } as const;

  protected readonly loading = generateLoadingState<[
    'updating new tech group skill',
    'adding new tech group skill'
  ]>();


  private readonly techGroups$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectTechGroups);

  private readonly techSkills = {
    list$: this.store.selectSignal(ADMIN_DATA_FEATURE.selectSkills),
  } as const;

  protected readonly table = this.initTable();

  private initTable() {

    const rowControls = () => {
      return {
        name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        generic: new FormControl(true, { nonNullable: true }),
        softwareId: new FormControl('', { nonNullable: true, validators: [] })
      };
    };

    const initAddTechGroup = () => {
      const form = new FormGroup({
        id: new FormControl('', {
          nonNullable: true,
          validators:
            [
              Validators.required,
              ({ value }) => {
                const list = this.techGroups$();
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

      const isAddingGeneric$ = toSignal(controlValue$(form.controls.generic, true), { initialValue: false });

      const submitting$ = this.loading.has('adding new tech group skill');
      const submitDisabled$ = this.loading.any$;

      const submit = () => {
        if (!form.valid)
          return;

        try {
          this.loading.add('adding new tech group skill');
          const value = form.getRawValue();

          if (value.generic) {
            const payload: GenericTechGroup = {
              id: value.id,
              name: value.name,
              generic: true,
              tech: []
            };
            this.store.dispatch(techGroupActions.add({ payload }));
          }
          else {
            const payload: NonGenericTechGroup = {
              id: value.id,
              name: value.name,
              generic: false,
              tech: [],
              softwareId: value.softwareId
            };
            this.store.dispatch(techGroupActions.add({ payload }));
          }

          form.reset({ generic: true });
        }
        catch (err) {
          SnackbarComponent.forError(this.snackbar, err);
        }
        finally {
          this.loading.delete('adding new tech group skill');
        }
      };

      {
        const control = form.controls.softwareId;
        effect(() => {
          const isAddingGeneric = isAddingGeneric$();
          if (isAddingGeneric)
            control.disable();
          else
            control.enable();
        });
      }

      return {
        form,
        submit,
        submitting$,
        submitDisabled$
      } as const;
    };

    const initUpdateTechGroup = () => {
      const injector = this.injector;

      const loading = generateLoadingState();
      this.loading.react('updating new tech group skill', loading.any$);

      const obs$ = toObservable(this.techGroups$)
        .pipe(
          startWith(this.techGroups$()),
          map((list) => {
            const rows = list.map((techGroup) => {

              const initTech = () => {
                const query$ = signal<string | object>('');

                // takes the list of skills and maps them into selectable options
                const all$ = computed(() => {
                  const skills = this.techSkills.list$();

                  return skills.map<SelectableOption<TechSkill>>(skill => ({
                    value: skill,
                    selected: false,
                    label: skill.name
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
                  const selected = techGroup.tech.map(id => map.get(id)!);

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
                  add: (option: SelectableOption<TechSkill>) => {
                    if (option.selected)
                      return;
                    option.selected = true;
                    this.store.dispatch(techGroupActions.addSkill({
                      payload: {
                        group: techGroup.id,
                        skill: option.value.id
                      }
                    }));
                  },
                  remove: (option: SelectableOption<TechSkill>) => {
                    this.store.dispatch(techGroupActions.removeSkill({
                      payload: {
                        group: techGroup.id,
                        skill: option.value.id
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
                return v.name !== techGroup.name ||
                  v.generic !== techGroup.generic;
              });

              const updating$ = loading.has(techGroup.id);

              const disableButtons$ = computed(() =>
                this.loading.any$() ||
                !changed$()
              );

              const reset = () => {
                form.reset({
                  id: techGroup.id,
                  name: techGroup.name,
                  generic: techGroup.generic,
                });
              };

              reset();

              const update = async () => {
                if (!form.valid)
                  return;

                try {
                  loading.add(techGroup.id);

                  const value = form.getRawValue();

                  let payload: TechGroup;
                  if (value.generic) {
                    payload = {
                      id: techGroup.id,
                      name: value.name,
                      generic: true,
                      tech: techGroup.tech
                    };
                  }
                  else {
                    payload = {
                      id: techGroup.id,
                      name: value.name,
                      generic: false,
                      tech: techGroup.tech,
                      softwareId: value.softwareId
                    };
                  }

                  this.store.dispatch(techGroupActions.update({ payload }));
                }
                catch (err) {
                  SnackbarComponent.forError(this.snackbar, err);
                }
                finally {
                  loading.delete(techGroup.id);
                }
              };

              return {
                data: techGroup,
                tech: initTech(),
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
      add: initAddTechGroup(),
      rows$: initUpdateTechGroup()
    } as const;
  }



}