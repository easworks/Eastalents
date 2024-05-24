import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import { adminData, techGroupActions } from '../state/admin-data';
import { MatExpansionModule } from '@angular/material/expansion';

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

  protected readonly maxlength = { name: 64 } as const;

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
          .filter(({ skills }) => skills.length > 0)
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

}