import { Directive, HostBinding, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl } from '@angular/forms';
import { startWith } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[formFieldControl]',
})
export class FormFieldDirective {
  @Input({ required: true, alias: 'formFieldControl' }) public control!: FormControl;

  @HostBinding() private get class() {
    return [
      'form-field',
      this.control.invalid ? 'invalid' : undefined,
      this.control.dirty ? 'dirty' : undefined
    ];
  }
}

export function statusChangesWithCurrent(control: AbstractControl) {
  return control.statusChanges.pipe(startWith(control.status));
}
export function valueChangesWithCurrent(control: AbstractControl) {
  return control.valueChanges.pipe(startWith(control.value))
}

export function statusSignal(control: AbstractControl) {
  return toSignal(statusChangesWithCurrent(control));
}

export function valueSignal(control: AbstractControl) {
  return toSignal(valueChangesWithCurrent(control));
}