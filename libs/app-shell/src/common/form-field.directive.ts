import { Directive, HostBinding, Injector, Input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, shareReplay, startWith } from 'rxjs';

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
  return control.statusChanges.pipe(startWith(control.status), shareReplay({ refCount: true, bufferSize: 1 }));
}
export function valueChangesWithCurrent<C extends AbstractControl>(control: C): Observable<TRawValue<C>> {
  return control.valueChanges.pipe(startWith(control.value), shareReplay({ refCount: true, bufferSize: 1 }));
}

export function statusSignal(control: AbstractControl, injector?: Injector) {
  return toSignal(statusChangesWithCurrent(control), { requireSync: true, injector });
}

export function valueSignal<C extends AbstractControl>(control: C, injector?: Injector): Signal<TRawValue<C>> {
  return toSignal(valueChangesWithCurrent(control), { requireSync: true, injector });
}

export type Ctrl<T extends FormGroup | FormArray> = T extends FormGroup ? T['controls'] : T['controls'][number];
