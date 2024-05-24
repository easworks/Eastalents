import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { pattern } from '@easworks/models';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { TechGroup } from '../../models/tech-skill';
import { adminData, techGroupActions } from '../../state/admin-data';

@Component({
  standalone: true,
  selector: 'create-tech-group',
  templateUrl: './create-tech-group.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatDialogClose,
    FormImportsModule
  ]
})
export class CreateTechGroupDialogComponent {

  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialogRef);
  private readonly snackbar = inject(MatSnackBar);

  protected readonly icons = {
    faXmark,
  } as const;

  private readonly loading = generateLoadingState<[
    'creating tech group'
  ]>();

  private readonly list$ = this.store.selectSignal(adminData.selectors.techGroup.selectAll);
  private readonly ids$ = computed(() => new Set(this.list$().map(group => group.id)));

  protected readonly formId = 'create-tech-group-form';

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

        const group: TechGroup = {
          id: value.id,
          name: value.name,
          generic: [],
          nonGeneric: [],
        };

        this.store.dispatch(techGroupActions.add({ payload: group }));
        SnackbarComponent.forSuccess(this.snackbar);
        this.dialog.close();
      },
      loading$: this.loading.has('creating tech group')
    } as const;

    const reset = {
      click: () => {
        console.debug('reset');
      }
    } as const;

    return {
      submit,
      reset,
      disabled$
    } as const;
  })();

  public static open(ref: MatDialogRef<DialogLoaderComponent>) {
    DialogLoaderComponent.replace(ref, this);
  }
}