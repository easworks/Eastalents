import { Injectable } from '@angular/core';
import { CACHE } from '@easworks/app-shell/common/cache';
import { clear, setMany, values } from 'idb-keyval';
import { Domain } from '../models/domain';
import { SoftwareProduct, TechGroup, TechSkill } from '../models/tech-skill';

@Injectable({
  providedIn: 'root'
})
export class AdminApi {

  readonly domains = {
    read: () => values<Domain>(CACHE.admin.domains),
    write: (data: Domain[]) => clear(CACHE.admin.domains)
      .then(() => setMany(data.map(domain => [domain.id, domain]), CACHE.admin.domains)),
  } as const;

  readonly softwareProducts = {
    read: () => values<SoftwareProduct>(CACHE.admin.softwareProducts),
    write: (data: SoftwareProduct[]) => clear(CACHE.admin.softwareProducts)
      .then(() => setMany(data.map(product => [product.id, product]), CACHE.admin.softwareProducts)),
  } as const;

  readonly techSkills = {
    read: () => values<TechSkill>(CACHE.admin.techSkills),
    write: (data: TechSkill[]) => clear(CACHE.admin.techSkills)
      .then(() => setMany(data.map(skill => [skill.id, skill]), CACHE.admin.techSkills))
  } as const;

  readonly techGroups = {
    read: () => values<TechGroup>(CACHE.admin.techGroups),
    write: (data: TechGroup[]) => clear(CACHE.admin.techGroups)
      .then(() => setMany(data.map(skill => [skill.id, skill]), CACHE.admin.techGroups))
  } as const;
}
