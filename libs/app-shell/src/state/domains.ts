import { Injectable, inject, signal } from '@angular/core';
import { DomainDictionaryDto, IndustryGroupDto, TechGroup, TechGroupDto } from '@easworks/models';
import { Domain, DomainModule, IndustryGroup, TalentApi } from '../api/talent.api';
import { generateLoadingState } from './loading';
import { sortString } from '../utilities/sort';

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

  readonly loading = generateLoadingState<[
    'domains',
    'tech',
    'industries'
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
    if (this.loading.set$().has('industries') || this.industries$().length)
      return;

    this.loading.add('industries');
    const r = await this.api.talent.industryGroups();
    const ig = mapIndustryGroupDto(r)
    this.industries$.set(ig);
    this.loading.delete('industries');
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
