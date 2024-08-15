export interface TechGroup {
  name: string;
  items: Set<string>;
}

export interface SoftwareProduct {
  name: string;
  imageUrl: string;
  tech: TechGroup[];
}
