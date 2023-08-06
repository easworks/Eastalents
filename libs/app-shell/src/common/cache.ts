import { createCache } from '../utilities/cache';

export const CACHE = {
  domains: createCache('domain-data'),
  csc: createCache('csc-cache')
} as const;
