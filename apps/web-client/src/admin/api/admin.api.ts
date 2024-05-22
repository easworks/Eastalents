import { Injectable } from '@angular/core';
import { CACHE } from '@easworks/app-shell/common/cache';
import { clear, setMany, values } from 'idb-keyval';
import { SoftwareProduct, TechSkill } from '../models/tech-skill';

@Injectable({
  providedIn: 'root'
})
export class AdminApi {

  readonly softwareProducts = {
    read: () => values<SoftwareProduct>(CACHE.admin.softwareProducts),
    write: (data: SoftwareProduct[]) => clear(CACHE.admin.softwareProducts)
      .then(() => setMany(data.map(product => [product.id, product]), CACHE.admin.softwareProducts)),
  } as const;

  readonly techSkills = {
    read: () => values<TechSkill>(CACHE.admin.techSkills),
    write: (data: TechSkill[]) => clear(CACHE.admin.techSkills)
      .then(() => setMany(data.map(skill => [skill.id, skill]), CACHE.admin.techSkills))
  };
}
