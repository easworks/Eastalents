export interface DomainDictionaryDto {
  [key: string]: DomainDto;
}

export interface DomainDto {
  'Primary Domain': string;
  Modules: { [key: string]: DomainModuleDto };
}

export interface DomainModuleDto {
  'Job roles': string[];
  Product: DomainProductDto[];
}

export interface DomainProductDto {
  name: string;
  imageUrl: string;
}
