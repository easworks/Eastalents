import { Injectable, inject, signal } from '@angular/core';
import { Domain, IndustryGroup, TalentApi, TechGroup } from '../api';
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

  readonly loading = generateLoadingState<[
    'domains',
    'tech',
    'industries'
  ]>();

  readonly domains$ = signal<Domain[]>([]);
  readonly tech$ = signal<TechGroup[]>([]);
  readonly industries$ = signal<IndustryGroup[]>([]);


  private getDomains() {
    if (this.loading.set$().has('domains') || this.domains$().length)
      return;

    this.loading.add('domains');
    this.api.talent.profileSteps()
      .subscribe(r => {
        this.domains$.set(r);
        this.loading.delete('domains');
      })
  }

  getTech() {
    if (this.loading.set$().has('tech') || this.tech$().length)
      return;

    this.loading.add('tech');
    this.api.talent.techGroups()
      .subscribe(r => {
        this.tech$.set(r);
        this.loading.delete('tech');
      })
  }

  getIndustries() {
    if (this.loading.set$().has('industries') || this.industries$().length)
      return;

    this.loading.add('industries');
    this.api.talent.industryGroups()
      .subscribe(r => {
        this.industries$.set(r);
        this.loading.delete('industries');
      })
  }
}