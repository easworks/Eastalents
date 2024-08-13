// the following types define the response that we currently get for the 
// consolidated list of domains / modules / product / jobs

export interface DomainDictionaryDto {
  [key: string]: DomainDto;
}

export interface DomainDto {
  'Primary Domain': string;
  'Role-Prefix and Product-Suffix': string | null;
  Modules: { [key: string]: DomainModuleDto; };
  Services: string[];
  Roles: boolean;
  Icons: boolean;
  Properties?: Record<string, Record<string, string[]>>;
}

export interface DomainModuleDto {
  'Job roles': string[];
  Product: DomainProductDto[];
}

export interface DomainProductDto {
  name: string;
  imageUrl: string;
}

export type TechGroupDto = Record<string, string[]>;
