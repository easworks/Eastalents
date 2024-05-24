import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import { adminData, techGroupActions } from '../state/admin-data';

@Component({
  standalone: true,
  selector: 'tech-groups-page',
  templateUrl: './tech-groups.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatExpansionModule
  ]
})
export class TechGroupsPageComponent {
  private readonly store = inject(Store);
  private readonly dRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  protected readonly maxlength = { name: 64 } as const;

  protected readonly icons = {
    faPlus
  } as const;
  private readonly loading = generateLoadingState<[
    'updating tech group',
    'adding tech group',
    'opening create-tech-group dialog'
  ]>();
  private readonly groups$ = this.store.selectSignal(adminData.selectors.techGroup.selectAll);
  private readonly skills$ = this.store.selectSignal(adminData.selectors.techSkill.selectEntities);

  protected readonly accordion = (() => {
    const panelControls = () => {
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

    const panels = (() => {
      const updating = generateLoadingState<string[]>();
      this.loading.react('updating tech group', updating.any$);

      let panelSubs = new Subscription();
      this.dRef.onDestroy(() => panelSubs.unsubscribe());

      const $ = computed(() => {
        panelSubs.unsubscribe();
        panelSubs = new Subscription();

        const skillMap = untracked(this.skills$);

        return this.groups$()
          .map(group => {
            const skills = group.generic.map(id => skillMap[id]!);
            return { group, skills };
          })
          .map(({ group, skills }) => {
            const form = new FormGroup({ ...panelControls() });


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

      return { $ } as const;
    })();

    return {
      panels
    } as const;

  })();

  protected readonly create = (() => {
    const loading$ = this.loading.has('opening create-tech-group dialog');
    const disabled$ = this.loading.any$;

    const click = async () => {
      try {
        this.loading.add('opening create-tech-group dialog');
        const comp = await import('./create/create-tech-group.dialog')
          .then(m => m.CreateTechGroupDialogComponent);

        console.debug(comp);
        comp.open(this.dialog);
      }
      finally {
        this.loading.delete('opening create-tech-group dialog');
      }
    };

    return {
      click,
      loading$,
      disabled$
    } as const;
  })();

}