import { Directive, HostBinding, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[formFieldControl]',
})
export class FormFieldDirective {

  @Input({ required: true, alias: 'formFieldControl' }) public control!: FormControl;

  @HostBinding('class') private get class() {
    return [
      'form-field',
      this.control.invalid ? 'invalid' : undefined,
      this.control.dirty ? 'dirty' : undefined
    ];
  }
}