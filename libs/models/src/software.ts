export interface TechGroup {
  name: string;
  items: Set<string>;
}

export type TechGroupDto = Record<string, string[]>;

export interface Software {
  name: string;
  tech: [string, string][];
}

export type SoftwareDto = Record<string, [string, string][]>;
