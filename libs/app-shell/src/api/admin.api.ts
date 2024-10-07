import { inject, Injectable } from '@angular/core';
import { FeaturedDomain } from '@easworks/models/featured';
import { IndustryGroupDTO } from '@easworks/models/industry';
import { clear, get, set, setMany, UseStore, values } from 'idb-keyval';
import { Domain } from 'models/domain';
import { SoftwareProduct, TechGroup, TechSkill } from 'models/software';
import { CACHE } from '../common/cache';

@Injectable({
  providedIn: 'root'
})
export class AdminApi {
  private readonly cache = inject(CACHE);

  readonly domains = (() => {
    const cache = this.cache?.domainData.domains;

    return cache ?
      entityCache<Domain>(cache) :
      dummyCache;
  })();

  readonly softwareProducts = (() => {
    const cache = this.cache?.domainData.softwareProducts;

    return cache ?
      entityCache<SoftwareProduct>(cache) :
      dummyCache;
  })();

  readonly techSkills = (() => {
    const cache = this.cache?.domainData.techSkills;

    return cache ?
      entityCache<TechSkill>(cache) :
      dummyCache;
  })();

  readonly techGroups = (() => {
    const cache = this.cache?.domainData.techGroups;

    return cache ?
      entityCache<TechGroup>(cache) :
      dummyCache;
  })();

  readonly featuredDomains = (() => {
    const cache = this.cache?.domainData.featuredDomains;

    return cache ?
      entityCache<FeaturedDomain>(cache) :
      dummyCache;
  })();

  readonly industries = {
    read: () => get<IndustryGroupDTO>('industries'),
    write: (dto: IndustryGroupDTO) => set('industries', dto)
  } as const;

}

const entityCache = <T extends { id: string | number; }>(cache: UseStore) => {
  return {
    read: () => values<T>(cache),
    write: (data: T[]) =>
      clear(cache)
        .then(() => setMany(data.map(group => [group.id, group]), cache))
  };
};

const dummyCache = {
  read: () => Promise.resolve([]),
  write: () => Promise.resolve(),
} as const;
