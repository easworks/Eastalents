import { Injectable, inject, signal } from '@angular/core';
import { TalentApi } from '../api';
import { sortString } from '../utilities';
import { generateLoadingState } from './loading';

export interface Domain {
  key: string;
  longName: string;
  prefix?: string;
  services: string[];
  modules: DomainModule[];
}

export interface DomainModule {
  name: string;
  roles: string[];
  products: DomainProduct[];
}

export interface DomainProduct {
  name: string;
  imageUrl: string;
}

export interface HomePageDomainDto {
  name: string;
  software: string[];
}

export interface TechGroup {
  name: string;
  tech: string[];
}

export interface IndustryGroup {
  name: string;
  industries: string[];
}

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

  private readonly dummyServices = new Array(10)
    .fill(0)
    .map((_, i) => `Dummy Service ${i}`);

  private getDomains() {
    if (this.loading.set$().has('domains') || this.domains$().length)
      return;

    this.loading.add('domains');
    this.api.talent.profileSteps()
      .subscribe(r => {
        const domains = Object.keys(r).map(dk => {
          const d: Domain = {
            key: dk,
            longName: r[dk]['Primary Domain'],
            services: this.dummyServices,
            modules: Object.entries(r[dk].Modules).map(([mk, v]) => {
              const m: DomainModule = {
                name: mk,
                roles: v['Job roles'].sort(sortString),
                products: v.Product.sort((a, b) => sortString(a.name, b.name))
              };
              return m;
            }).sort((a, b) => sortString(a.name, b.name))
          };
          return d;
        }).sort((a, b) => sortString(a.key, b.key));

        this.domains$.set(domains);

        this.loading.delete('domains');
      })
  }

  getTech() {
    if (this.loading.set$().has('tech') || this.tech$().length)
      return;

    this.loading.add('tech');
    this.api.talent.techGroups()
      .subscribe(r => {
        this.tech$.set(Object.keys(r)
          .map(key => ({
            name: key,
            tech: r[key]
          })));
        this.loading.delete('tech');
      })
  }

  getIndustries() {
    if (this.loading.set$().has('industries') || this.industries$().length)
      return;

    this.loading.add('industries');
    this.api.talent.industryGroups()
      .subscribe(r => {
        this.industries$.set(Object.keys(r)
          .map(key => ({
            name: key,
            industries: r[key]
          })));
        this.loading.delete('industries');
      })
  }
}