export interface Domain {
  id: string;
  longName: string;
  shortName: string;

  modules: string[];
  services: string[];
  roles: string[];
  products: string[];
}
