import { Signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pattern } from '@easworks/models';
import { Country } from '../api/csc';
import { sortString } from '../utilities/sort';
import { controlValue$ } from './form-field.directive';

type PhoneCodeOption = Country & { plainPhoneCode: string };

const notNumber = /[^\d\s]/g;
export function getPhoneCodeOptions(countries: Country[]) {
  const mapped = [] as Country[];

  countries.forEach(c => {
    if (c.phonecode.includes('and')) {
      const codes = c.phonecode.split(' and ');
      codes.forEach(code => mapped.push({
        ...c,
        phonecode: code,
      }));
    }
    else mapped.push(c);
  });

  return mapped
    .map<PhoneCodeOption>(c => ({
      ...c,
      plainPhoneCode: c.phonecode.replace(notNumber, '')
    }))
    .sort((a, b) => sortString(a.plainPhoneCode, b.plainPhoneCode))
}

export function filterCountryCode(all$: Signal<PhoneCodeOption[]>, value$: Signal<string | null>) {
  return computed(() => {
    const all = all$();
    const value = value$();
    const filter = value && value.replace(notNumber, '');
    if (filter)
      return all.filter(c => c.plainPhoneCode.toLowerCase().includes(filter));
    return all;
  });
}

type Form = FormGroup<{
  code: FormControl<string | null>;
  number: FormControl<string | null>;
}>
const telPattern = Validators.pattern(pattern.telephone);

export function updatePhoneValidatorEffect(form: Form) {
  const value$ = toSignal(controlValue$(form), { requireSync: true });
  const hasValue = computed(() => {
    const value = value$();
    return !!value.code || !!value.number;
  });

  const { code, number } = form.controls;

  effect(() => {
    if (hasValue()) {
      code.setValidators([Validators.required]);
      number.setValidators([Validators.required, telPattern]);
    }
    else {
      code.clearValidators();
      number.clearValidators();
    }

    code.updateValueAndValidity();
    number.updateValueAndValidity();

  }, { allowSignalWrites: true })
}
