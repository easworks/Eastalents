import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, filter, shareReplay, startWith } from 'rxjs';

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

export function controlStatus$(control: AbstractControl) {
  return control.statusChanges.pipe(startWith(control.status), shareReplay({ refCount: true, bufferSize: 1 }));
}

export function controlValue$<C extends AbstractControl>(control: C, validOnly = false): Observable<TRawValue<C>> {
  let v$ = control.valueChanges;
  v$ = v$.pipe(startWith(control.value))
  if (validOnly)
    v$ = v$.pipe(filter(() => control.valid));
  return v$.pipe(shareReplay({ refCount: true, bufferSize: 1 }));
}

export type Ctrl<T extends FormGroup | FormArray> = T extends FormGroup ? T['controls'] : T['controls'][number];
