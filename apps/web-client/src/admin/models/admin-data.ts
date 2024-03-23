import { SoftwareProduct, TechGroup, TechSkill } from '../models/tech-skill';
import { Domain, DomainModule } from './domain';
import { EASRole } from './eas-role';
import { FeaturedProductDomain } from './featured';

export interface AdminDataState {
  skills: TechSkill[];
  techGroups: TechGroup[];
  easRoles: EASRole[];
  softwareProducts: SoftwareProduct[];
  domainModules: DomainModule[];
  domains: Domain[];
  featureProducts: FeaturedProductDomain[];
}
