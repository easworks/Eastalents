import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faCheck, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import { TechSkill } from '../../models/tech-skill';
import { adminData, techSkillActions } from '../../state/admin-data';

@Component({
  standalone: true,
  selector: 'tech-skills-page',
  templateUrl: './tech-skills.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule
  ]
})
export class TechSkillsPageComponent {
  private readonly store = inject(Store);
  private readonly dRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  protected readonly icons = {
    faCheck,
    faRefresh,
    faPlus
  } as const;

  protected readonly maxlength = { name: 64 } as const;

  private readonly skills$ = this.store.selectSignal(adminData.selectors.techSkill.selectAll);
  private readonly loading = generateLoadingState<[
    'updating tech skill',
  ]>();

  protected readonly table = (() => {
    const rowControls = () => {
      return {
        name: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.maxLength(this.maxlength.name)
          ]
        }),
      };
    };

    const rows = (() => {
      const updating = generateLoadingState<string[]>();
      this.loading.react('updating tech skill', updating.any$);

      let rowSubs = new Subscription();
      this.dRef.onDestroy(() => rowSubs.unsubscribe());

      const $ = computed(() => {
        rowSubs.unsubscribe();
        rowSubs = new Subscription();

        return this.skills$().map(skill => {
          const form = new FormGroup({ ...rowControls() });

          const changeCheck = (value: typeof form['value']) =>
            value.name === skill.name;

          const valid$ = signal(form.status === 'VALID');
          const unchanged$ = signal(changeCheck(form.value));

          const disableButtons$ = computed(() => this.loading.any$() || unchanged$());

          const reset = {
            click: () => {
              form.reset({
                name: skill.name
              });
            },
            disabled$: disableButtons$
          } as const;

          const submit = {
            click: () => {
              if (!form.valid)
                return;

              try {
                updating.add(skill.id);
                const value = form.getRawValue();
                const payload: TechSkill = {
                  ...skill,
                  name: value.name
                };

                this.store.dispatch(techSkillActions.update({ payload }));
              }
              finally {
                updating.delete(skill.id);
              }
            },
            disabled$: disableButtons$,
            loading$: updating.has(skill.id)
          } as const;

          const groups = async () => {
            const ref = DialogLoaderComponent.open(this.dialog);
            const comp = await import('../group/tech-skill-groups.dialog')
              .then(m => m.TechSkillGroupsDialogComponent);

            comp.open(ref, {
              skill
            });
          };

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
            data: skill,
            form,
            submit,
            reset,
            groups
          };
        });
      });

      return {
        $
      } as const;
    })();

    return {
      rows
    } as const;

  })();

  protected readonly create = (() => {
    const click = async () => {
      const ref = DialogLoaderComponent.open(this.dialog);
      const comp = await import('../create/create-tech-skill.dialog')
        .then(m => m.CreateTechSkillDialogComponent);
      comp.open(ref);
    };

    return {
      click,
    } as const;
  })();

}