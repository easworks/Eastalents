import { Directive, HostBinding, Input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl } from '@angular/forms';
import { Observable, startWith } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[formFieldControl]',
})
export class FormFieldDirective {
  @Input({ required: true, alias: 'formFieldControl' }) public control!: FormControl;

  @HostBinding() private get class() {
    return [
      'form-field',
      this.control.invalid ? 'invalid' : '',
      this.control.dirty ? 'dirty' : '',
      this.control.disabled ? 'disabled' : ''
    ];
  }
}

type TRawValue<C> = C extends AbstractControl<unknown, infer R> ? R : never;

export function statusChangesWithCurrent(control: AbstractControl) {
  return control.statusChanges.pipe(startWith(control.status));
}
export function valueChangesWithCurrent<C extends AbstractControl>(control: C): Observable<TRawValue<C>> {
  return control.valueChanges.pipe(startWith(control.value));
}

export function statusSignal(control: AbstractControl) {
  return toSignal(statusChangesWithCurrent(control), { requireSync: true });
}

export function valueSignal<C extends AbstractControl>(control: C): Signal<TRawValue<C>> {
  return toSignal(valueChangesWithCurrent(control), { requireSync: true });
}