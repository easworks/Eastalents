import { EntityState } from '@ngrx/entity';
import { SoftwareProduct, TechGroup, TechSkill } from '../models/tech-skill';
import { Domain, DomainModule } from './domain';
import { EASRole } from './eas-role';
import { FeaturedProductDomain, FeaturedRoleDomain } from './featured';

export interface AdminDataState {
  techSkills: EntityState<TechSkill>;
  techGroups: EntityState<TechGroup>;
  // easRoles: EASRole[];
  softwareProducts: EntityState<SoftwareProduct>;
  // domainModules: DomainModule[];
  // domains: Domain[];
  // featuredProducts: FeaturedProductDomain[];
  // featuredRoles: FeaturedRoleDomain[];
}

export interface AdminDataDTO {
  softwareProducts: SoftwareProduct[];
  techSkills: Omit<TechSkill, 'groups'>[];
  techGroups: TechGroup[];
}
