

export interface Domain {
  id: string;
  longName: string;
  prefix: string | null;
  shortName: string;
  modules: string[];
  services: string[];

  // this is a aggregation of all products from all modules in the domain
  products: string[];//software products

  disabled: boolean;
}


export interface DomainModule {
  id: string;
  name: string;
  products: string[];
  roles: string[];
}
