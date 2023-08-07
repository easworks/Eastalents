import { Injectable, computed, inject, signal } from '@angular/core';
import { Domain, DomainDictionaryDto, DomainModule, IndustryGroup, IndustryGroupDto, SoftwareProduct, TechGroup, TechGroupDto } from '@easworks/models';
import { TalentApi } from '../api/talent.api';
import { CACHE } from '../common/cache';
import { sortString } from '../utilities/sort';

const ONE_HOUR_MS = 60 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class DomainState {
  constructor() {
    this.loadDomains();

    const sigs = this.initSignals();

    this.domains = sigs.domains;
    this.products = sigs.products;
    this.tech = sigs.tech;
  }

  private readonly api = {
    talent: inject(TalentApi)
  } as const;

  private readonly cache = CACHE.domains;

  readonly domains;
  readonly products;
  readonly tech;
  readonly industries$ = signal<IndustryGroup[]>([]);


  private async loadDomains() {
    try {
      const cached = await this.cache.get<Map<string, Domain>>('domains', ONE_HOUR_MS);
      if (cached) {
        const domains = cached;
        const products = await this.cache.get<Map<string, SoftwareProduct>>('products');
        const tech = await this.cache.get<Map<string, TechGroup>>('tech');
        if (!products || !tech)
          throw new Error('invalid operation');

        const getProduct = (name: string) => {
          const found = products.get(name);
          if (!found)
            throw new Error('invalid operation');
          return found;
        };

        domains.forEach(d => {
          d.products = d.products.map(p => getProduct(p.name));
          d.modules.forEach(m => m.products = m.products.map(p => getProduct(p.name)));
        });

        this.domains.map$.set(domains);
        this.products.map$.set(products);
        this.tech.map$.set(tech);
        return;
      }
    }
    catch (e) {
      console.error(e);
    }

    const [ddto, tdto] = await Promise.all([
      this.api.talent.profileSteps(),
      this.api.talent.techGroups()
    ]);

    const { domains, tech, products } = mapDomainEntities(ddto, tdto);

    await this.cache.set('domains', domains);
    await this.cache.set('tech', tech);
    await this.cache.set('products', products);

    this.domains.map$.set(domains);
    this.products.map$.set(products);
    this.tech.map$.set(tech);
  }

  async loadIndustries() {
    const cacheKey = 'industries';
    const cached = await this.cache.get<IndustryGroup[]>(cacheKey);
    if (cached)
      this.industries$.set(cached);

    const r = await this.api.talent.industryGroups();
    const ig = mapIndustryGroupDto(r);
    await this.cache.set(cacheKey, ig);
    this.industries$.set(ig);
  }

  private initSignals() {
    const maps = {
      domains: signal(new Map<string, Domain>()),
      products: signal(new Map<string, SoftwareProduct>()),
      tech: signal(new Map<string, TechGroup>())
    } as const;

    const lists = {
      domains: computed(() => {
        const values = [...maps.domains().values()];
        values.sort((a, b) => sortString(a.key, b.key));
        values.forEach(d => {
          d.services.sort(sortString);
          d.products.sort((a, b) => sortString(a.name, b.name));
          d.modules.sort((a, b) => sortString(a.name, b.name));

          d.modules.forEach(m => {
            m.roles.sort(sortString);
            m.products.sort((a, b) => sortString(a.name, b.name));
          });
        });
        return values;
      }),
      products: computed(() => {
        const values = [...maps.products().values()];
        values.sort((a, b) => sortString(a.name, b.name));
        values.forEach(p => {
          p.tech.sort((a, b) => sortString(a.name, b.name));
          p.tech.forEach(tg => tg.items = new Set([...tg.items].sort(sortString)));
        });
        return values;
      }),
      tech: computed(() => {
        const values = [...maps.tech().values()];
        values.sort((a, b) => sortString(a.name, b.name));
        values.forEach(v => v.items = new Set([...v.items].sort(sortString)));
        return values;
      })
    } as const;

    return {
      domains: {
        map$: maps.domains,
        list$: lists.domains
      },
      products: {
        map$: maps.products,
        list$: lists.products
      },
      tech: {
        map$: maps.tech,
        list$: lists.tech
      }
    };
  }
}

function mapDomainEntities(ddto: DomainDictionaryDto, tdto: TechGroupDto) {
  const tech = new Map<string, TechGroup>();
  const products = new Map<string, SoftwareProduct>();
  const domains = new Map<string, Domain>();
  const mapLog = [] as string[];

  mapTechGroupDto(tdto).forEach(tg => tech.set(tg.name, tg));
  // console.debug([...tech.values()].sort((a, b) => sortString(a.name, b.name)));

  Object.keys(ddto).forEach(dk => {
    const input = ddto[dk];

    const dp = new Set<string>();

    const d: Domain = {
      key: dk,
      longName: input['Primary Domain'],
      prefix: input['Role-Prefix and Product-Suffix'],
      services: input.Services,
      modules: Object.entries(input.Modules)
        .map(([mk, v]) => {
          const m: DomainModule = {
            name: mk,
            roles: v['Job roles'],
            products: v.Product
              .map(p => {
                dp.add(p.name);
                const found = products.get(p.name);
                if (found)
                  return found;
                const np: SoftwareProduct = { ...p, tech: [] };
                products.set(np.name, np);
                return np;
              })
          };

          return m;
        }),
      products: [...dp].map(k => {
        const p = products.get(k);
        if (!p)
          throw new Error('invalid operation');
        return p;
      })
    };

    const associations = input.Properties;
    if (associations) {
      mapLog.push(`module '${d.key}' provides product associations`);

      Object.entries(associations).forEach(([pk, tg]) => {
        let product = products.get(pk);
        if (!product) {
          mapLog.push(`creating new product:  '${pk}'`);
          product = {
            name: pk,
            imageUrl: pk,
            tech: []
          };
          products.set(product.name, product);
        }

        Object.entries(tg).forEach(([tgk, skills]) => {
          let tg = tech.get(tgk);
          if (!tg) {
            mapLog.push(`creating new tech group:  '${tgk}'`);
            tg = {
              name: tgk,
              items: new Set()
            };
            tech.set(tg.name, tg);
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          skills.forEach(s => tg!.items.add(s));

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const found = product!.tech.find(g => g.name === tg!.name);
          if (found) {
            skills.forEach(s => found.items.add(s));
          }
          else {
            const ng: TechGroup = {
              name: tg.name,
              items: new Set(skills)
            };
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            product!.tech.push(ng);
          }
        });

      });
    }

    domains.set(dk, d);
  });

  // console.debug(mapLog.join('\n'));
  // console.debug([...tech.values()].sort((a, b) => sortString(a.name, b.name)));
  return { domains, products, tech };
}

function mapTechGroupDto(dto: TechGroupDto) {
  return Object.keys(dto).map<TechGroup>(key => ({
    name: key,
    items: new Set(dto[key])
  }));
}

function mapIndustryGroupDto(dto: IndustryGroupDto) {
  return Object.keys(dto).map<IndustryGroup>(key => ({
    name: key,
    industries: dto[key]
  }));
}
