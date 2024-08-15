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
import { domainData, techGroupActions } from 'app-shell/state/domain-data';
import Fuse, { FuseResult } from 'fuse.js';
import { TechSkill } from 'models/software';
import { Subscription, map } from 'rxjs';

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
  private readonly groups$ = this.store.selectSignal(domainData.selectors.techGroup.selectAll);

  private readonly skills = (() => {
    const list$ = this.store.selectSignal(domainData.selectors.techSkill.selectAll);

    const search$ = computed(() => new Fuse(list$(), {
      keys: ['name'],
      includeScore: true
    }));


    return {
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

      let rowSubs = new Subscription();
      this.dRef.onDestroy(() => rowSubs.unsubscribe());

      const unfiltered$ = computed(() => {
        rowSubs.unsubscribe();
        rowSubs = new Subscription();

        return this.groups$()
          .map(group => {
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


            rowSubs.add(form.statusChanges
              .pipe(map(s => s === 'VALID'))
              .subscribe(valid$.set),

            );
            rowSubs.add(form.valueChanges
              .pipe(map(changeCheck))
              .subscribe(unchanged$.set)
            );

            reset.click();

            const skills = () => this.editSkills(group.id);

            return {
              data: group,
              form,
              submit,
              reset,
              skills,
              unchanged$
            };
          });
      });

      const $ = computed(() => {
        const full = unfiltered$();
        const selected = this.search.selected$();
        if (selected)
          return full.filter(row => row.data.skills.includes(selected.id));
        else
          return full;
      });

      return { $ } as const;
    })();

    const empty$ = computed(() => rows.$().length === 0);

    return {
      rows,
      empty$
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

  private readonly editSkills = async (id: string) => {
    const ref = DialogLoaderComponent.open(this.dialog);
    const comp = await import('../skills/tech-group-skills.dialog')
      .then(m => m.TechGroupSkillsDialogComponent);

    comp.open(ref, { group: id });
  };


}