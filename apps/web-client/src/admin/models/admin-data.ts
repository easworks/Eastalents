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
  softwareProducts: SoftwareProduct[];
  techSkills: Omit<TechSkill, 'groups'>[];
  techGroups: TechGroup[];
}
