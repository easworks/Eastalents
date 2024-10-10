import { InjectionToken } from '@angular/core';
import { createStore } from 'idb-keyval';
import { customKeyvalStore } from '../utilities/create-keyval-store';
import { isBrowser } from '../utilities/platform-type';


export const CACHE = new InjectionToken('CACHE', {
  providedIn: 'root',
  factory: () => {
    if (!isBrowser())
      return;

    const domainDataDB = customKeyvalStore('domain-data');
    const cache = {
      domainData: {
        domains: domainDataDB('domains'),
        softwareProducts: domainDataDB('software-products'),
        techSkills: domainDataDB('tech-skills'),
        techGroups: domainDataDB('tech-groups'),
        featuredDomains: domainDataDB('featured-domains')
      },
      auth: createStore('auth', 'auth')
    };
    return cache;
  }
});
