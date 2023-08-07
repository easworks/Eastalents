import { SoftwareProduct } from './software';

export interface Domain {
    key: string;
    longName: string;
    prefix: string | null;
    services: string[];
    modules: DomainModule[];
    products: SoftwareProduct[];
    featured: boolean;
}

export interface DomainModule {
    name: string;
    roles: string[];
    products: SoftwareProduct[];
}
