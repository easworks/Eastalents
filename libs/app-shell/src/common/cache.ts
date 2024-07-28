import { InjectionToken } from '@angular/core';
import { customKeyvalStore } from '../utilities/create-keyval-store';
import { isBrowser } from '../utilities/platform-type';
import { createStore } from 'idb-keyval';


export const CACHE = new InjectionToken('CACHE', {
  providedIn: 'root',
  factory: () => {
    if (!isBrowser())
      return;

    const domainDataDB = customKeyvalStore('domain-data');
    const cache = {
      admin: {
        domains: domainDataDB('domains'),
        softwareProducts: domainDataDB('software-products'),
        techSkills: domainDataDB('tech-skills'),
        techGroups: domainDataDB('tech-groups')
      },
      auth: createStore('auth', 'auth')
    };
    return cache;
  }
});
