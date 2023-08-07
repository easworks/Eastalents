import { AbstractControl } from '@angular/forms';
import { IANAZone } from 'luxon';

export const isTimezone = (control: AbstractControl<string | null>) => {
  if (control.value) {
    if (!IANAZone.isValidZone(control.value)) {
      return { invalid: true }
    }
  }
  return null;
}

