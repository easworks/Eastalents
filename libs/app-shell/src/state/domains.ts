import { Injectable, inject, signal } from '@angular/core';
import { DomainDictionaryDto, IndustryGroupDto, TechGroup, TechGroupDto } from '@easworks/models';
import { createStore, get, set } from 'idb-keyval';
import { Domain, DomainModule, IndustryGroup, TalentApi } from '../api/talent.api';
import { sortString } from '../utilities/sort';
import { generateLoadingState } from './loading';

@Injectable({
  providedIn: 'root'
})
export class DomainState {
  constructor() {
    this.getDomains();
  }

  private readonly api = {
    talent: inject(TalentApi)
  } as const;

  private readonly cache = this.initCache();

  readonly loading = generateLoadingState<[
    'domains',
    'tech'
  ]>();

  readonly domains$ = signal<Domain[]>([]);
  readonly tech$ = signal<TechGroup[]>([]);
  readonly industries$ = signal<IndustryGroup[]>([]);


  private async getDomains() {
    if (this.loading.set$().has('domains') || this.domains$().length)
      return;

    this.loading.add('domains');

    const r = await this.api.talent.profileSteps();

    console.debug(r);

    const domains = mapDomainDto(r);
    this.domains$.set(domains);
    this.loading.delete('domains');
  }

  async getTech() {
    if (this.loading.set$().has('tech') || this.tech$().length)
      return;

    this.loading.add('tech');
    const r = await this.api.talent.techGroups()
    const tech = mapTechGroupDto(r)
    this.tech$.set(tech);
    this.loading.delete('tech');

  }

  async getIndustries() {
    const cacheKey = 'industries'
    const cached = await this.cache.get<IndustryGroup[]>(cacheKey);
    if (cached)
      this.industries$.set(cached);

    const r = await this.api.talent.industryGroups();
    const ig = mapIndustryGroupDto(r)
    await this.cache.set(cacheKey, ig);
    this.industries$.set(ig);
  }

  private initCache() {
    const storeName = 'domain-data';
    const store = createStore(storeName, storeName);

    return {
      get: <T>(id: string) => get<T>(id, store),
      set: <T>(id: string, data: T) => set(id, data, store),
    } as const;

  }
}

function mapDomainDto(dto: DomainDictionaryDto) {
  return Object.keys(dto).map(dk => {
    const d: Domain = {
      key: dk,
      longName: dto[dk]['Primary Domain'],
      prefix: dto[dk]['Role-Prefix and Product-Suffix'],
      services: dto[dk].Services.sort(sortString),
      modules: Object.entries(dto[dk].Modules).map(([mk, v]) => {
        const m: DomainModule = {
          name: mk,
          roles: v['Job roles'].sort(sortString),
          products: v.Product.sort((a, b) => sortString(a.name, b.name))
        };
        return m;
      }).sort((a, b) => sortString(a.name, b.name)),
      allProducts: []
    };

    const products = new Set<string>([]);
    d.modules.forEach(m => m.products.forEach(p => {
      if (products.has(p.name))
        return;
      products.add(p.name);
      d.allProducts.push(p);
    }));

    return d;
  }).sort((a, b) => sortString(a.key, b.key))
}

function mapTechGroupDto(dto: TechGroupDto) {
  return Object.keys(dto).map<TechGroup>(key => ({
    name: key,
    items: new Set(dto[key])
  }))
}

function mapIndustryGroupDto(dto: IndustryGroupDto) {
  return Object.keys(dto).map<IndustryGroup>(key => ({
    name: key,
    industries: dto[key]
  }))
}
