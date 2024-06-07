import { TechGroupDto } from '@easworks/models';
import { TechGroup, TechSkill } from './tech-skill';
import { convertToSlug } from '@easworks/models/seo';
import { sortString } from '@easworks/app-shell/utilities/sort';

const alt_ids = {
  techSkills: {
    'C#': 'c-sharp',
    'C++': 'c-plus-plus',
    '.NET': 'dotnet'
  } as Record<string, string>,
  techGroups: {

  } as Record<string, string>,
} as const;

export function extractTechSkills(dto: TechGroupDto) {

  const maps = {
    techSkills: new Map<string, TechSkill>(),
    techGroups: new Map<string, TechGroup>(),
  } as const;

  const map = maps.techGroups;
  for (const [name, skills] of Object.entries(dto)) {
    let id: string;
    if (name in alt_ids.techGroups) {
      id = alt_ids.techGroups[name];
      console.warn(log.altKey('tech-group', name, id));
    }
    else {
      id = convertToSlug(name);
      const mapped = map.get(id);
      if (mapped) {
        console.warn(log.conflict('tech-group', name, id, mapped.name));
        if (mapped.name !== name)
          throw new Error(log.error('tech-group', name));
      }
    }

    const group: TechGroup = { id, name, generic: [], nonGeneric: [] };
    map.set(id, group);

    {
      const map = maps.techSkills;
      const genericSkills = new Set<string>();

      for (const name of skills) {
        let id: string;
        if (name in alt_ids.techSkills) {
          id = alt_ids.techSkills[name];
          console.warn(log.altKey('tech-skill', name, id));
        }
        else {
          id = convertToSlug(name);
          const mapped = map.get(id);
          if (mapped) {
            console.warn(log.conflict('tech-skill', name, id, mapped.name));
            if (mapped.name !== name)
              throw new Error(log.error('tech-skill', name));
          }
        }

        const skill: TechSkill = { id, name };
        map.set(id, skill);
        genericSkills.add(skill.id);
      }

      group.generic = [...genericSkills].sort(sortString);
    }
  }


  return maps;
}

type Scope = 'tech-skill' | 'tech-group';

const log = {
  altKey: (scope: Scope, name: string, altKey: string) => `[${scope}] | ${name} -> using alternate key: ${altKey}`,
  conflict: (scope: Scope, name: string, id: string, mapped: string) => `[${scope}] | ${name} -> conflicting key: '${id}' | '${mapped}'`,
  error: (scope: Scope, name: string,) => `['${scope}'] | ${name} -> resolve above issue`
} as const;