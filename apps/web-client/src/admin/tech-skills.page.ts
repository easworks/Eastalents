import { ChangeDetectionStrategy, Component, INJECTOR, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faCheck, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { map, shareReplay, startWith } from 'rxjs';
import { ADMIN_DATA_FEATURE, techSkillActions } from './state/admin-data';

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
  private readonly injector = inject(INJECTOR);

  protected readonly icons = {
    faCheck,
    faRefresh
  } as const;

  protected readonly loading = generateLoadingState<[
    'updating new tech skill',
    'adding new tech skill'
  ]>();


  private readonly data$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectAdminDataState);
  private readonly list$ = computed(() => this.data$().skills);

  protected readonly table = this.initTable();

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

    const initUpdateTechSkill = () => {
      const injector = this.injector;
      const loading = generateLoadingState();

      const obs$ = toObservable(this.list$)
        .pipe(
          startWith(this.list$()),
          map((list) => {
            const rows = list.map(ts => {
              const form = new FormGroup({
                id: new FormControl('', { nonNullable: true }),
                ...rowControls()
              });

              const value$ = toSignal(
                controlValue$(form),
                { requireSync: true, injector });

              const changed$ = computed(() => {
                const v = value$();
                return v.name !== ts.name ||
                  v.generic !== ts.generic;
              });

              const updating$ = loading.has(ts.id);

              const disableButtons$ = computed(() =>
                this.loading.any$() ||
                !changed$()
              );

              const reset = () => {
                form.reset({
                  id: ts.id,
                  name: ts.name,
                  generic: ts.generic
                });
              };

              reset();

              const update = () => {
                if (!form.valid)
                  return;

                console.debug(form.getRawValue());
              };

              return {
                data: ts,
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
      add: initAddTechSkill(),
      rows$: initUpdateTechSkill()
    } as const;
  }


}
