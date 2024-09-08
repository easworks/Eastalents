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



export interface DomainDataDTO {
  domains: Domain[];
  softwareProducts: Omit<SoftwareProduct, 'domains'>[];
  techSkills: TechSkill[];
  techGroups: Omit<TechGroup, 'skills'>[];
}