import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { Store } from '@ngrx/store';
import { ADMIN_DATA_FEATURE, techSkillActions } from './state/admin-data';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'admin-tech-skills-page',
  templateUrl: './tech-skills.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatCheckboxModule
  ]
})
export class TechSkillsPageComponent {

  private readonly store = inject(Store);
  private readonly snackbar = inject(MatSnackBar);

  protected readonly icons = {
    faCheck
  } as const;

  protected readonly loading = generateLoadingState<[
    'updating new tech skill',
    'adding new tech skill'
  ]>();


  protected readonly data$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectAdminDataState);
  protected readonly list$ = computed(() => this.data$().skills);

  protected readonly table = this.initTable();

  protected readonly formArray = new FormArray([]);

  private readonly form = new FormGroup({
    id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    generic: new FormControl(true, { nonNullable: true }),
  });

  private initTable() {
    const rowControls = () => {
      return {
        name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        generic: new FormControl(true, { nonNullable: true }),
      };
    };

    const initAddTechSkill = () => {
      const form = new FormGroup({
        id: new FormControl('', {
          nonNullable: true,
          validators:
            [
              Validators.required,
              ({ value }) => {
                const list = this.list$();
                const exists = list.some(tech => tech.id === value);
                if (exists)
                  return { exists: true };
                return null;
              }
            ],
        }),
        ...rowControls()
      }
      );

      const submitting$ = this.loading.has('adding new tech skill');
      const submitDisabled$ = this.loading.any$;

      const submit = () => {
        if (!form.valid)
          return;

        try {
          this.loading.add('adding new tech skill');
          const value = form.getRawValue();

          this.store.dispatch(techSkillActions.add({ payload: value }));

          form.reset({ generic: true });
        }
        catch (err) {
          SnackbarComponent.forError(this.snackbar, err);
        }
        finally {
          this.loading.delete('adding new tech skill');
        }
      };

      return {
        form,
        submit,
        submitting$,
        submitDisabled$
      } as const;
    };

    return {
      add: initAddTechSkill()
    } as const;
  }


}
