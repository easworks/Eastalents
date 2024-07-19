import { Signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pattern } from '@easworks/models';
import Fuse from 'fuse.js';
import { Country } from '../api/csc.api';
import { controlValue$ } from './form-field.directive';

export type PhoneCodeOption = {
  id: string;
  flag: string;
  code: string;
  name: string;
  countryId: number;
};

export function getPhoneCodeOptions(countries: Country[]) {
  const mapped = [] as PhoneCodeOption[];

  countries.forEach(country => {
    if (country.phonecode.includes('and')) {
      const codes = country.phonecode.split(' and ');
      codes.forEach(code => mapped.push({
        id: `${code}/${country.name}`,
        countryId: country.id,
        flag: country.emoji,
        name: country.name,
        code
      }));
    }
    else {
      mapped.push({
        id: `${country.phonecode}/${country.name}`,
        countryId: country.id,
        flag: country.emoji,
        name: country.name,
        code: country.phonecode
      });
    }
  });

  return mapped;
}

export function filterCountryCode(all$: Signal<PhoneCodeOption[]>, query$: Signal<string>) {
  const index$ = computed(() => new Fuse(all$(), {
    keys: ['code']
  }));

  return computed(() => {
    const q = query$().trim();
    if (q)
      return index$().search(q).map(r => r.item);

    return all$();

  });
}

export type PhoneCodeForm = FormGroup<{
  code: FormControl<string>;
  number: FormControl<string>;
}>;
const telPattern = Validators.pattern(pattern.telephone);

export function updatePhoneValidatorEffect(form: PhoneCodeForm) {
  const value$ = toSignal(controlValue$(form), { requireSync: true });
  const hasValue = computed(() => {
    const value = value$();
    return !!value.code || !!value.number;
  });

  const { code, number } = form.controls;

  effect(() => {
    if (hasValue()) {
      code.setValidators([Validators.required, telPattern]);
      number.setValidators([Validators.required, telPattern]);
    }
    else {
      code.clearValidators();
      number.clearValidators();
    }

    code.updateValueAndValidity();
    number.updateValueAndValidity();

  }, { allowSignalWrites: true });
}

export function getCombinedNumber(value: ReturnType<PhoneCodeForm['getRawValue']>) {
  return value.code ? `${value.code}${value.number}` : null;
}
