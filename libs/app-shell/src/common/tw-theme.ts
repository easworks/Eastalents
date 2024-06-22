import { InjectionToken, isDevMode } from '@angular/core';
import type { Config } from 'tailwindcss';

type Theme = Config['theme'];

declare const __TW_THEME: Theme | undefined;


export const TW_THEME = new InjectionToken<NonNullable<Theme>>('TW_THEME', {
  providedIn: 'root',
  factory: () => {
    if (!__TW_THEME)
      throw new Error('cannot inject tailwind theme - __TW_THEME is unavailable');
    if (isDevMode())
      console.debug(__TW_THEME);

    return __TW_THEME;
  }
});
