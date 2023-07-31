import { Signal, computed } from '@angular/core';
import { Country } from '../api/csc';
import { sortString } from '../utilities/sort';

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
