import { AbstractControl } from '@angular/forms';

export function emailBlacklist(blacklist: Promise<string[]>) {
  return async (c: AbstractControl<string>) => {
    const value = c.value;
    const bl = await blacklist;
    if (bl.some(d => value.endsWith(d)))
      return { blacklisted: true };
    return null;
  };
}
