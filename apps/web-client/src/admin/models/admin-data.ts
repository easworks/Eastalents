import { EntityState } from '@ngrx/entity';
import { SoftwareProduct, TechGroup, TechSkill } from '../models/tech-skill';
import { Domain } from './domain';
import { FeaturedDomain } from './featured';

export interface AdminDataState {
  techSkills: EntityState<TechSkill>;
  techGroups: EntityState<TechGroup>;
  softwareProducts: EntityState<SoftwareProduct>;
  domains: EntityState<Domain>;
  featuredDomains: FeaturedDomain[];
}

export interface AdminDataDTO {
  domains: Domain[];
  softwareProducts: Omit<SoftwareProduct, 'domains'>[];
  techSkills: TechSkill[];
  techGroups: Omit<TechGroup, 'skills'>[];
}
