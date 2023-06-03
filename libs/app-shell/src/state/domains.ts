import { Injectable, inject, signal } from '@angular/core';
import { TalentApi } from '../api';
import { sortString } from '../utilities';

export interface Domain {
  shortName: string;
  longName: string;

  modules: DomainModule[];
}

export interface DomainModule {
  name: string;
  jobRoles: string[];
  products: DomainProduct[];
}

export interface DomainProduct {
  name: string;
  imageUrl: string;
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

  readonly loading$ = signal(true);
  readonly domains$ = signal<Domain[]>([]);

  private getDomains() {
    this.loading$.set(true);
    this.api.talent.profileSteps()
      .subscribe(r => {
        const domains = Object.keys(r).map(dk => {
          const d: Domain = {
            shortName: dk,
            longName: r[dk]['Primary Domain'],
            modules: Object.entries(r[dk].Modules).map(([mk, v]) => {
              const m: DomainModule = {
                name: mk,
                jobRoles: v['Job roles'],
                products: v.Product
              };
              return m;
            })
          };
          return d;
        });
        domains.sort((a, b) => sortString(a.shortName, b.shortName));

        this.domains$.set(domains);

        this.loading$.set(false);
      })
  }

}