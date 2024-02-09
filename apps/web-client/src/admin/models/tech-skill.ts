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
  tech: GenericTechSkill[];
}

export interface NonGenericTechGroup extends Omit<GenericTechGroup, 'generic' | 'tech'> {
  generic: false;
  softwareId: string;
  tech: TechSkill[];
}

export type TechGroup = GenericTechGroup | NonGenericTechGroup;
