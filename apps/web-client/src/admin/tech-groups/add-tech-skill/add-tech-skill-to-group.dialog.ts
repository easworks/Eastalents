import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import type Fuse from 'fuse.js';
import type { FuseResult } from 'fuse.js';
import { TechGroup, TechSkill } from '../../models/tech-skill';

interface AddTechSkillToGroupDialogData {
  search: Fuse<TechSkill>;
  group: TechGroup;
}

@Component({
  standalone: true,
  selector: 'add-tech-skill-to-group-dialog',
  templateUrl: './add-tech-skill-to-group.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule,
    MatDialogClose,
    MatAutocompleteModule
  ]
})
export class AddTechSkillToGroupDialogComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialogRef);
  private readonly snackbar = inject(MatSnackBar);
  private readonly data = inject<AddTechSkillToGroupDialogData>(MAT_DIALOG_DATA);

  protected readonly icons = {
    faXmark,
  } as const;

  private readonly loading = generateLoadingState<[
    'adding tech skill to group'
  ]>();

  protected readonly formId = 'add-tech-tech-skill-to-group-form';

  private readonly validators = {
    skill: (() => {
      const exists = new Set(this.data.group.generic);
      return (control: AbstractControl) => {
        const value = control.value as TechSkill | string;
        if (typeof value === 'string')
          return { notFound: true };
        else {
          if (exists.has(value.id))
            return { exists: true };
        }
        return null;
      };
    })()
  } as const;

  protected readonly form = new FormGroup({
    skill: new FormControl('' as TechSkill | string, {
      validators: [
        Validators.required,
        this.validators.skill
      ]
    }),
  });

  protected readonly search = (() => {

    const query$ = toSignal(controlValue$(this.form.controls.skill), { requireSync: true });

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
        const options = this.data.search.search(q);
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

  protected readonly buttons = (() => {
    const disabled$ = this.loading.any$;

    const submit = {
      click: () => {
        console.debug('submitting');
      },
      loading$: this.loading.has('adding tech skill to group')
    } as const;

    return {
      submit,
      disabled$
    } as const;
  })();

  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: AddTechSkillToGroupDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
  }
}