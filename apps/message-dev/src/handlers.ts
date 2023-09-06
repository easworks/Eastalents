import { Domain, DomainDictionaryDto, DomainModule, SoftwareProduct, TechGroup, TechGroupDto } from '@easworks/models';
import { FastifyPluginAsync } from 'fastify';
import { readFile, readdir, stat } from 'fs/promises';
import { fetch } from 'undici';

export const handlers: FastifyPluginAsync = async server => {
  server.get('/verify-software-images', async () => {
    const domainDto = await fetch('https://eas-works.onrender.com/api/talentProfile/getTalentProfileSteps')
      .then<any>(r => r.json())
      .then<DomainDictionaryDto>(r => r.talentProfile);
    const techDto = JSON.parse(await readFile('./libs/shared/assets/src/utils/tech.json', { encoding: 'utf-8' })) as TechGroupDto;
    const featuredDomains = JSON.parse(await readFile('./libs/shared/assets/src/utils/featured-domains.json', { encoding: 'utf-8' })) as {
      domain: string;
      products: string[];
    }[];

    try {
      const maps = mapDomainEntities(domainDto, techDto);

      const toDo = [] as string[];

      for (const fd of featuredDomains) {
        const domain = maps.domains.get(fd.domain);
        if (!domain) {
          toDo.push(`domain '${fd.domain}' not found`);
          continue;
        }

        const imageFolder = `./libs/shared/assets/src/software/products/${domain.key}`;
        const exists = await stat(imageFolder)
          .catch(() => false);
        if (!exists) {
          toDo.push(`- image folder for domain ${domain.key} does not exist`);
          continue;
        }

        const filesOnDisk = new Set(await readdir(imageFolder));
        for (const p of fd.products) {
          const product = maps.products.get(p);
          if (!product) {
            toDo.push(`- product '${p}' in domain '${domain.key}' not found`);
            continue;
          }

          const imageFile = `${imageFolder}/${product.name}.png`;
          filesOnDisk.delete(`${product.name}.png`);
          // expectedFiles.add(path.resolve(imageFile));
          const exists = await stat(imageFile)
            .catch(() => false);
          if (!exists) {
            toDo.push(`- expected file '${domain.key}/${product.name}.png' not found`);
            continue;
          }
        }

        filesOnDisk.forEach(f =>
          toDo.push(`- unexpected file '${domain.key}/${f}' was found`));

        toDo.push('');
      };

      return toDo.join('\n');
    }
    catch (e) {
      console.error(e);
      throw e;
    }


  });
};


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
      featured: input.Icons,
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