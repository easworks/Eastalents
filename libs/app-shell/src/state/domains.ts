import { Injectable, inject, signal } from '@angular/core';
import { TalentApi } from '../api';
import { sortString } from '../utilities';

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

  readonly loading$ = signal(false);
  readonly domains$ = signal<Domain[]>([]);

  private readonly dummyServices = new Array(10)
    .fill(0)
    .map((_, i) => `Dummy Service ${i}`);

  private getDomains() {
    if (this.loading$())
      return;

    this.loading$.set(true);
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

        this.loading$.set(false);
      })
  }

}