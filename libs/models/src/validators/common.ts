import { pattern } from '../pattern';
import { z } from 'zod';

export const objectId = z.string().trim()
  .length(24)
  .regex(pattern.hex.lowercase);

export const username = (() => {

  const base = z.string()
    .min(8).max(32)
    .regex(pattern.username.plain)
    .refine(v => !v.startsWith('_'), 'no-underscore-at-start')
    .refine(v => !v.endsWith('_'), 'no-underscore-at-end')
    .refine(v => !v.includes('__'), 'no-consecutive-underscores');

  const plain = z.string().trim()
    .pipe(base);
  const prefixed = z.string().trim()
    .refine(v => v.startsWith('@'), 'start-with-at')
    .transform(v => v.substring(1))
    .pipe(base)
    .transform(v => '@' + v);

  return { plain, prefixed };
})();