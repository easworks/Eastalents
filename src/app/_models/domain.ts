export interface DomainDictionary {
  [key: string]: Domain;
}

export interface Domain {
  "Primary Domain": string;
  Modules: { [key: string]: DomainModule };
}

export interface DomainModule {
  "Job roles": string[];
  Product: DomainProduct[];
}

export interface DomainProduct {
  name: string;
  imageUrl: string;
}