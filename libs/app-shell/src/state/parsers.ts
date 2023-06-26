import { RecordList, TechGroup, TechGroupDto } from '@easworks/models';
import { sortString } from '../utilities';

export const parse = {
  techDto: (dto: TechGroupDto): RecordList<string, TechGroup> => {
    const record: Record<string, TechGroup> = {};

    const list = Object.keys(dto)
      .sort(sortString)
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
} as const;
