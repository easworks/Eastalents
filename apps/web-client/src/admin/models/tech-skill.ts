export interface TechSkill {
  id: string,
  name: string;
}

export interface TechGroup {
  id: string,
  name: string;
  generic: string[];
  nonGeneric: string[];
}


export interface SoftwareProduct {
  id: string;
  name: string;
  imageUrl: string;
  techGroup: string[];
}
