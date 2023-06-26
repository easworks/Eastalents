import { Software, SoftwareDto, TechGroup, TechGroupDto } from '@easworks/models';
import { sortString } from '../utilities/sort';
import { RefinementCtx, z, ZodIssueCode } from 'zod';

const unpaddedString = z.string()
  .refine((s: string) => s.length === s.trim().length, (v) => ({ message: `'${v}' has leading/trailing space(s)` }));

const ensureUnique = <T>(extractor: (v: T) => string) => {
  return (val: T[], ctx: RefinementCtx) => {
    const set = new Set<string>();

    for (const v of val) {
      const e = extractor(v);
      if (set.has(e)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: `'${v}' is repeated`,
        });
      }
      set.add(e);
    }
  }
}

const stringSet = z.array(unpaddedString)
  .superRefine(ensureUnique(v => v))

export const parse = {
  techDto: (dto: TechGroupDto, validate = false): Map<string, TechGroup> => {
    if (validate) {
      z.record(unpaddedString, stringSet)
        .parse(dto);
    }

    const map = new Map<string, TechGroup>();

    Object.keys(dto)
      .sort(sortString)
      .forEach(k => map.set(k, {
        name: k,
        items: new Set(dto[k].sort(sortString)),
      }));

    return map;
  },
  softwareDto: (dto: SoftwareDto, validate = false, tech?: Map<string, TechGroup>): Map<string, Software> => {
    if (validate) {
      if (!tech)
        throw new Error('must provide tech values for validation');

      z.record(
        unpaddedString,
        z.array(
          z.tuple([
            unpaddedString,
            unpaddedString
          ]).superRefine(([category, item], ctx) => {
            const found = tech.get(category);
            if (!found) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                message: `tech: category '${category}' does not exist`
              });
            }
            else if (!found.items.has(item)) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                message: `tech: item '${item}' does not exist in ${category}`
              })
            }
          })
        )
      ).parse(dto)
    }

    const map = new Map<string, Software>();

    Object.keys(dto)
      .sort(sortString)
      .forEach(k => map.set(k, {
        name: k,
        tech: dto[k]
      }));

    return map;
  }
} as const;
