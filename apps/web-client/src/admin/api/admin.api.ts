import { inject, Injectable } from '@angular/core';
import { CACHE } from '@easworks/app-shell/common/cache';
import { clear, setMany, UseStore, values } from 'idb-keyval';
import { Domain } from '../models/domain';
import { SoftwareProduct, TechGroup, TechSkill } from '../models/tech-skill';

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
