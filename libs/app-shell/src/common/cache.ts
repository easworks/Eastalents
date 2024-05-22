import { createCache } from '../utilities/cache';
import { customKeyvalStore } from '../utilities/create-keyval-store';

const adminDataDB = customKeyvalStore('admin-data');

export const CACHE = {
  domains: createCache('domain-data'),
  csc: createCache('csc-cache'),
  admin: {
    softwareProducts: adminDataDB('software-products'),
    techSkills: adminDataDB('tech-skills')
  }
} as const;
