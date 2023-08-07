import { Signal, effect } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

export function dynamicallyRequired(
  isRequired: Signal<boolean>,
  control: FormControl<string>
) {
  effect(() => {
    if (isRequired()) {
      control.addValidators(Validators.required);
    }
    else {
      control.removeValidators(Validators.required);
    }
    control.updateValueAndValidity();
  }, { allowSignalWrites: true })

}