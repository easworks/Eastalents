import { Domain } from "./domain";
import { SoftwareProduct } from "./software";

export interface FeaturedDomain {
  domain: string;
  software: string[];
  roles: string[];
}

export interface updateDisplayFeatureProduct {
  domainId: string;
  domainName: string;
  domainData: Domain[];
  softareId?: string[];
  softwareProduct?: SoftwareProduct[];
}
