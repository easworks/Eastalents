import { isDevMode } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export function emailBlacklist(blacklist: Promise<string[]>) {
  return async (c: AbstractControl<string>) => {
    const value = c.value;
    if (isDevMode()) return null;
    const bl = await blacklist;
    if (bl.some(d => value.endsWith(d)))
      return { blacklisted: true };
    return null;
  };
}
