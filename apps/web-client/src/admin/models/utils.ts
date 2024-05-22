import { TechGroupDto } from '@easworks/models';
import { TechSkill } from './tech-skill';
import { convertToSlug } from '@easworks/models/seo';

export function extractTechSkills(dto: TechGroupDto) {
  const acceptable_conflicts: Record<string, string> = {
    'C#': 'c-sharp',
    'C++': 'c-plus-plus',
    '.NET': 'dotnet'
  };

  const map = new Map<string, TechSkill>();

  for (const list of Object.values(dto)) {
    for (const name of list) {
      let id = convertToSlug(name);

      if (name in acceptable_conflicts) {
        console.warn(`'${name}' -> using alternate key: '${acceptable_conflicts[name]}'`);
        id = acceptable_conflicts[name];
      }
      else if (map.has(id)) {
        const mapped = map.get(id)!;
        console.warn(`'${name}' -> conflicting key: '${id}' | ${mapped.name}`);
        if (mapped.name !== name)
          throw new Error(`'${name}' -> resolve above issue`);
      }

      const skill: TechSkill = { id, name };
      map.set(id, skill);
    }
  }

  console.debug('total tech skills:', map.size);

  return [...map.values()];

}