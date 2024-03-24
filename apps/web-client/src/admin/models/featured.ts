import { Domain } from "./domain";
import { SoftwareProduct } from "./tech-skill";

export interface FeaturedProductDomain {
  domain: string;
  software: string[];
}

export interface FeaturedRoleDomain {
  domain: string;
  roles: string[];
}

export interface updateDisplayFeatureProduct {
  domainId: string;
  domainName: string;
  domainData: Domain[];
  softareId?: string[];
  softwareProduct?: SoftwareProduct[];
}
