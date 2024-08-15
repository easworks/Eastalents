import type { EntityState } from '@ngrx/entity';
import { FeaturedDomain } from './featured';
import { SoftwareProduct, TechGroup, TechSkill } from './software';

export interface Domain {
  id: string;
  longName: string;
  shortName: string;

  modules: string[];
  services: string[];
  roles: string[];
  products: string[];
}

export interface DomainDataState {
  techSkills: EntityState<TechSkill>;
  techGroups: EntityState<TechGroup>;
  softwareProducts: EntityState<SoftwareProduct>;
  domains: EntityState<Domain>;
  featuredDomains: FeaturedDomain[];
}

export interface DomainDataDTO {
  domains: Domain[];
  softwareProducts: Omit<SoftwareProduct, 'domains'>[];
  techSkills: TechSkill[];
  techGroups: Omit<TechGroup, 'skills'>[];
}