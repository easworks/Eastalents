import { RecordList } from './utils';

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

export function parseTechDto(dto: TechGroupDto): RecordList<string, TechGroup> {
  const record: Record<string, TechGroup> = {};

  const list = Object.keys(dto)
    .map(k => {
      const tg: TechGroup = {
        name: k,
        items: new Set(dto[k])
      };
      record[k] = tg;
      return tg;
    });

  return { record, list };
}
