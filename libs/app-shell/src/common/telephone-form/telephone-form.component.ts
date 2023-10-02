import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, Signal, computed, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DropDownIndicatorComponent } from '../drop-down-indicator.component';
import { FormImportsModule } from '../form.imports.module';
import { PhoneCodeForm, PhoneCodeOption } from '../phone-code';
import { toSignal } from '@angular/core/rxjs-interop';
import { controlValue$ } from '../form-field.directive';

@Component({
  standalone: true,
  selector: 'telephone-form',
  templateUrl: './telephone-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormImportsModule,
    MatAutocompleteModule,
    DropDownIndicatorComponent
  ]
})
export class TelephoneFormComponent {
  @HostBinding()
  private readonly class = 'block';

  @Input({ required: true })
  form!: PhoneCodeForm;

  @Input({ required: true })
  phoneCodeOptions$!: Signal<PhoneCodeOption[]>;

  private code$ = toSignal(controlValue$(this.form.controls.number), { requireSync: true });
  // protected filteredOptions$ = computed();


  static readonly createForm = {
    required: () => {
      return new FormGroup({
        code: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required]
        }),
        number: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required]
        })
      });
    },
    optional: () => {
      return new FormGroup({
        code: new FormControl(''),
        number: new FormControl('')
      });
    }
  } as const;
}