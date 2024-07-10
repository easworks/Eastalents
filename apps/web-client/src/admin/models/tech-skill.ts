export interface TechSkill {
  id: string,
  name: string;
  groups: string[];
}

export interface TechGroup {
  id: string,
  name: string;
  skills: string[];
}


export interface SoftwareProduct {
  id: string;
  name: string;
  imageUrl: string;
  skills: Record<string, string[]>;
  domains: string[];
}
