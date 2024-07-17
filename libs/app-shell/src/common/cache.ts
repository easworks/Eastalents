import { InjectionToken } from '@angular/core';
import { createCache } from '../utilities/cache';
import { customKeyvalStore } from '../utilities/create-keyval-store';
import { isBrowser } from '../utilities/platform-type';


export const CACHE = new InjectionToken('CACHE', {
  providedIn: 'root',
  factory: () => {
    if (!isBrowser())
      return;

    const adminDataDB = customKeyvalStore('admin-data');
    const cache = {
      domains: createCache('domain-data'),
      csc: createCache('csc-cache'),
      admin: {
        domains: adminDataDB('domains'),
        softwareProducts: adminDataDB('software-products'),
        techSkills: adminDataDB('tech-skills'),
        techGroups: adminDataDB('tech-groups')
      }
    };
    return cache;
  }
});
