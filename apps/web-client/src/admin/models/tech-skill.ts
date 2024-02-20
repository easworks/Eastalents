export interface GenericTechSkill {
  id: string,
  name: string;
  generic: true;
}

export interface NonGenericTechSkill extends Omit<GenericTechSkill, 'generic'> {
  generic: false;
}

export type TechSkill = GenericTechSkill | NonGenericTechSkill;


export interface GenericTechGroup {
  id: string,
  name: string;
  generic: true;
  tech: string[];
}

export interface NonGenericTechGroup extends Omit<GenericTechGroup, 'generic'> {
  generic: false;
  softwareId: string;
}

export type TechGroup = GenericTechGroup | NonGenericTechGroup;

export function techGroupId(tg: TechGroup) {
  if (tg.generic)
    return tg.id;
  else
    return `${tg.id}/${tg.softwareId}`;
}

export interface SoftwareProduct {
  id: string;
  name: string;
  imageUrl: string;
  techGroup: string[];
}
