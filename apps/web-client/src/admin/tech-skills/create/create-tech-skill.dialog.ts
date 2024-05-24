import { Component, computed, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { pattern } from '@easworks/models';
import { faQuestionCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { TechSkill } from '../../models/tech-skill';
import { adminData, techSkillActions } from '../../state/admin-data';

@Component({
  standalone: true,
  selector: 'create-tech-skill-dialog',
  templateUrl: './create-tech-skill.dialog.html',
  imports: [
    ImportsModule,
    MatDialogClose,
    FormImportsModule
  ]
})
export class CreateTechSkillDialogComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialogRef);
  private readonly snackbar = inject(MatSnackBar);

  protected readonly icons = {
    faXmark,
    faQuestionCircle
  } as const;

  private readonly loading = generateLoadingState<[
    'creating tech skill'
  ]>();

  private readonly list$ = this.store.selectSignal(adminData.selectors.techSkill.selectAll);
  private readonly ids$ = computed(() => new Set(this.list$().map(skill => skill.id)));

  protected readonly formId = 'create-tech-skill-form';

  protected readonly maxlength = {
    id: 64,
    name: 64
  } as const;

  private readonly validators = {
    id: (control: AbstractControl) => {
      const value = control.value as string;
      if (this.ids$().has(value))
        return { exists: true };

      return null;
    }
  } as const;

  protected readonly form = new FormGroup({
    id: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(pattern.slug),
        Validators.maxLength(this.maxlength.id),
        this.validators.id
      ]
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(this.maxlength.name)
      ]
    })
  }, { updateOn: 'submit' });

  protected readonly buttons = (() => {
    const disabled$ = this.loading.any$;

    const submit = {
      click: () => {
        if (!this.form.valid)
          return;

        const value = this.form.getRawValue();

        const skill: TechSkill = {
          id: value.id,
          name: value.name,
        };

        this.store.dispatch(techSkillActions.add({ payload: skill }));
        SnackbarComponent.forSuccess(this.snackbar);
        this.dialog.close();
      },
      loading$: this.loading.has('creating tech skill')
    } as const;

    return {
      submit,
      disabled$
    } as const;
  })();

  public static open(ref: MatDialogRef<DialogLoaderComponent>) {
    DialogLoaderComponent.replace(ref, this);
  }
}