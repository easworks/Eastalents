import { Component, computed, inject, signal, untracked } from '@angular/core';
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
import Fuse from 'fuse.js';
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

  private readonly skills = (() => {
    const list$ = this.store.selectSignal(adminData.selectors.techSkill.selectAll);
    const ids$ = computed(() => new Set(list$().map(skill => skill.id)));
    const search$ = computed(() => new Fuse(list$(), {
      keys: ['name'],
      includeScore: true
    }));

    return {
      ids$,
      search$
    } as const;

  })();

  protected readonly formId = 'create-tech-skill-form';

  protected readonly maxlength = {
    id: 64,
    name: 64
  } as const;

  private readonly validators = {
    id: (control: AbstractControl) => {
      const value = control.value as string;
      if (this.skills.ids$().has(value))
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
          groups: []
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

  protected readonly similarity = (() => {
    const input$ = signal('');

    const items$ = computed(() => {

      const input = input$();
      if (!input)
        return [];

      return untracked(this.skills.search$).search(input)
        .map(result => result.item)
        .slice(0, 5);
    });

    const show$ = computed(() => items$().length > 0);

    return {
      input$,
      items$,
      show$
    } as const;
  })();

  protected reset() {
    this.similarity.input$.set('');
  }

  public static open(ref: MatDialogRef<DialogLoaderComponent>) {
    DialogLoaderComponent.replace(ref, this);
  }
}