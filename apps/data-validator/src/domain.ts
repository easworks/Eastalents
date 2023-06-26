import { sortString } from '@easworks/app-shell/utilities/sort';
import { writeFile } from 'fs/promises';

function getDomains() {
  return fetch('http://eas-works.onrender.com/api/talentProfile/getTalentProfileSteps')
    .then(r => r.json())
    .then(m => m.talentProfile);

  // return import(new URL('./assets/domain-response.json', import.meta.url).toString(), { assert: { type: 'json' } })
  // .then(m => m.default.talentProfile);
}

async function processDomains(domains: any) {

  const todo: Promise<void>[] = [];

  const softSet = new Set<string>();

  Object.keys(domains)
    .forEach(domain => Object.keys(domains[domain].Modules)
      .forEach(module => domains[domain].Modules[module].Product
        .forEach((p: any) => softSet.add(p.name))));

  {
    const record: Record<string, any[]> = {};
    [...softSet.values()].sort(sortString).forEach(v => record[v] = []);

    todo.push(writeFile('./libs/shared/assets/src/utils/software.json', JSON.stringify(record, null, 2) + '\n', { encoding: 'utf-8' }));
  }

  await Promise.all(todo);
}

export async function fetchAndProcessDomains() {
  const domains = await getDomains();
  await processDomains(domains);
}
