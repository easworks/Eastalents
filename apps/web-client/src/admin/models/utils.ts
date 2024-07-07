import { sortString } from '@easworks/app-shell/utilities/sort';
import { DomainDictionaryDto, TechGroupDto } from '@easworks/models';
import { convertToSlug } from '@easworks/models/seo';
import { Domain } from './domain';
import { SoftwareProduct, TechGroup, TechSkill } from './tech-skill';

const alt_ids = {
  techSkills: {
    'C#': 'c-sharp',
    'C++': 'c-plus-plus',
    '.NET': 'dotnet'
  } as Record<string, string>,
  techGroups: {

  } as Record<string, string>,
  softwareProducts: {
    'Oracle Netsuite': 'oracle-netsuite',
    'Oracle NetSuite': 'oracle-netsuite',
    'BOARD International': 'board-international',
  } as Record<string, string>,
} as const;

export class ExtractionLogger {
  private readonly warnings: string[] = [];
  public warn(message: string) {
    console.warn(message);
    this.warnings.push(message);
  };

  public dump() {
    console.log({
      warnings: this.warnings
    });
  }

}

export function extractTechSkills(dto: TechGroupDto, logger: ExtractionLogger) {

  const maps = {
    techSkills: new Map<string, TechSkill>(),
    techGroups: new Map<string, TechGroup>(),
  } as const;

  const map = maps.techGroups;
  for (const [name, skills] of Object.entries(dto)) {
    let id: string;
    if (name in alt_ids.techGroups) {
      id = alt_ids.techGroups[name];
      logger.warn(log.altKey('tech-group', name, id));
    }
    else {
      id = convertToSlug(name);
      const mapped = map.get(id);
      if (mapped) {
        logger.warn(log.conflict('tech-group', name, id, mapped.name));
        if (mapped.name !== name)
          throw new Error(log.error('tech-group', name));
      }
    }

    const group: TechGroup = { id, name, skills: [] };
    map.set(id, group);

    {
      const map = maps.techSkills;
      const genericSkills = new Set<string>();

      for (const name of skills) {
        let id: string;
        if (name in alt_ids.techSkills) {
          id = alt_ids.techSkills[name];
          logger.warn(log.altKey('tech-skill', name, id));
        }
        else {
          id = convertToSlug(name);
          const mapped = map.get(id);
          if (mapped) {
            logger.warn(log.conflict('tech-skill', name, id, mapped.name));
            if (mapped.name !== name)
              throw new Error(log.error('tech-skill', name));
          }
        }

        const skill: TechSkill = { id, name, groups: [group.id] };
        map.set(id, skill);
        genericSkills.add(skill.id);
      }
    }
  }


  return maps;
}

export function extractDomains(dto: DomainDictionaryDto, logger: ExtractionLogger) {
  const maps = {
    domains: new Map<string, Domain>(),
    products: new Map<string, SoftwareProduct>(),
  } as const;

  for (const [key, domainDto] of Object.entries(dto)) {
    const domain: Domain = {
      id: key,
      longName: domainDto['Primary Domain'],
      shortName: key,
      modules: [],
      roles: [],
      products: [],
      services: [],
    };

    const modules = new Set<string>();
    const roles = new Set<string>();
    const services = new Set<string>();
    const products = new Set<string>();

    domainDto.Services.forEach(service => services.add(service));

    for (const [key, module] of Object.entries(domainDto.Modules)) {
      modules.add(key);
      module['Job roles'].forEach(role => roles.add(role));

      {
        const map = maps.products;
        for (const productDto of module.Product) {
          const name = productDto.name;
          let id: string;
          if (name in alt_ids.softwareProducts) {
            id = alt_ids.softwareProducts[name];
            logger.warn(log.altKey('software-product', name, id));
          }
          else {
            id = convertToSlug(name);
            const mapped = map.get(id);
            if (mapped) {
              if (mapped.name !== name) {
                logger.warn(log.conflict('software-product', name, id, mapped.name));
                throw new Error(log.error('software-product', name));
              }
            }
          }

          const product: SoftwareProduct = {
            id,
            name,
            imageUrl: '',
            skills: {}
          };
          map.set(product.id, product);
          products.add(product.id);
        }
      }
    }

    domain.services = [...services].sort(sortString);
    domain.modules = [...modules].sort(sortString);
    domain.roles = [...roles].sort(sortString);
    domain.products = [...products].sort(sortString);
    maps.domains.set(domain.id, domain);
  }

  return maps;
}

type Scope = 'tech-skill' | 'tech-group' | 'software-product';

const log = {
  altKey: (scope: Scope, name: string, altKey: string) => `[${scope}] | ${name} -> using alternate key: '${altKey}'`,
  conflict: (scope: Scope, name: string, id: string, mapped: string) => `[${scope}] | ${name} -> conflicting key: '${id}' | '${mapped}'`,
  error: (scope: Scope, name: string,) => `[${scope}] | ${name} -> resolve above issue`
} as const;