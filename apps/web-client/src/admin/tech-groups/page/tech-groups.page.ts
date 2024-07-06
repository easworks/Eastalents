import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faCheck, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import Fuse, { FuseResult } from 'fuse.js';
import { Subscription, map } from 'rxjs';
import { TechSkill } from '../../models/tech-skill';
import { adminData, techGroupActions } from '../../state/admin-data';

@Component({
  standalone: true,
  selector: 'tech-groups-page',
  templateUrl: './tech-groups.page.html',
  styleUrl: './tech-groups.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatExpansionModule,
    MatAutocompleteModule
  ]
})
export class TechGroupsPageComponent {
  private readonly store = inject(Store);
  private readonly dRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  protected readonly maxlength = { name: 64 } as const;

  protected readonly icons = {
    faPlus,
    faCheck,
    faRefresh
  } as const;
  private readonly loading = generateLoadingState<[
    'updating tech group',
    'adding tech group',
  ]>();
  private readonly groups$ = this.store.selectSignal(adminData.selectors.techGroup.selectAll);

  private readonly skills = (() => {
    const list$ = this.store.selectSignal(adminData.selectors.techSkill.selectAll);
    const map$ = this.store.selectSignal(adminData.selectors.techSkill.selectEntities);

    const search$ = computed(() => new Fuse(list$(), {
      keys: ['name'],
      includeScore: true
    }));


    return {
      list$,
      map$,
      search$
    } as const;
  })();

  protected readonly search = (() => {

    const query$ = signal('' as TechSkill | string);
    const displayWith = (v: TechSkill | string | null) => typeof v === 'string' ? v : v?.name || '';

    const selected$ = computed(() => {
      const q = query$();
      return typeof q === 'string' ? null : q;
    });
    const hasSelection$ = computed(() => selected$() !== null);

    const options$ = signal([] as FuseResult<TechSkill>[]);

    effect(() => {

      const q = query$();

      if (typeof q === 'string') {
        const options = untracked(this.skills.search$).search(q);
        options$.set(options);
      }
    }, { allowSignalWrites: true });

    return {
      query$,
      options$,
      displayWith,
      selected$,
      hasSelection$
    } as const;
  })();

  protected readonly table = (() => {
    const rowControls = () => {
      return {
        name: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.maxLength(this.maxlength.name)
          ]
        })
      };
    };

    const rows = (() => {
      const updating = generateLoadingState<string[]>();
      this.loading.react('updating tech group', updating.any$);

      let panelSubs = new Subscription();
      this.dRef.onDestroy(() => panelSubs.unsubscribe());

      const unfiltered$ = computed(() => {
        panelSubs.unsubscribe();
        panelSubs = new Subscription();

        const skillMap = untracked(this.skills.map$);
        const skillCount$ = computed(() => this.skills.list$().length);

        return this.groups$()
          .map(group => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const genericSkills = group.generic.map(id => skillMap[id]!);
            return { group, genericSkills };
          })
          .map(({ group, genericSkills }) => {
            const form = new FormGroup({ ...rowControls() });


            const changeCheck = (value: typeof form['value']) =>
              value.name === group.name;

            const valid$ = signal(form.status === 'VALID');
            const unchanged$ = signal(changeCheck(form.value));

            const disableButtons$ = computed(() => this.loading.any$() || unchanged$());

            const reset = {
              click: () => {
                form.reset({
                  name: group.name
                });
              },
              disabled$: disableButtons$
            } as const;

            const submit = {
              click: () => {
                if (!form.valid)
                  return;

                try {
                  this.loading.add('updating tech group');
                  const { name } = form.getRawValue();
                  this.store.dispatch(techGroupActions.update({ payload: { id: group.id, name } }));
                }
                finally {
                  this.loading.delete('updating tech group');
                }
              },
              disabled$: disableButtons$,
              loading$: updating.has(group.id)
            } as const;


            panelSubs.add(form.statusChanges
              .pipe(map(s => s === 'VALID'))
              .subscribe(valid$.set),

            );
            panelSubs.add(form.valueChanges
              .pipe(map(changeCheck))
              .subscribe(unchanged$.set)
            );

            reset.click();

            const skills = (() => {
              const list = genericSkills;

              const create = (() => {
                const visible$ = computed(() => skillCount$() > list.length);

                const click = async () => {
                  const ref = DialogLoaderComponent.open(this.dialog);
                  const comp = await import('../add-tech-skill/add-tech-skill-to-group.dialog')
                    .then(m => m.AddTechSkillToGroupDialogComponent);
                  comp.open(ref, {
                    search: this.skills.search$(),
                    group
                  });
                };

                return {
                  visible$,
                  click
                } as const;
              })();

              return {
                list,
                create
              } as const;
            })();

            return {
              data: group,
              skills,
              form,
              submit,
              reset,
              unchanged$
            };
          });
      });

      const $ = computed(() => {
        const full = unfiltered$();
        const selected = this.search.selected$();
        if (selected)
          return full.filter(panel => panel.data.generic.includes(selected.id));
        else
          return full;
      });

      return { $ } as const;
    })();

    return {
      rows
    } as const;

  })();

  protected readonly create = (() => {
    const click = async () => {
      const ref = DialogLoaderComponent.open(this.dialog);
      const comp = await import('../create/create-tech-group.dialog')
        .then(m => m.CreateTechGroupDialogComponent);

      comp.open(ref);
    };

    return {
      click,
    } as const;
  })();



}