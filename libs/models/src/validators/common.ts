import { pattern } from '../pattern';
import { z } from 'zod';

export const objectId = z.string().trim()
  .length(24)
  .regex(pattern.hex.lowercase);

export const username = z.string().trim()
  .min(5).max(20)
  .regex(pattern.username.plain)
  .refine(v => !v.startsWith('_'), 'no-underscore-at-start')
  .refine(v => !v.endsWith('_'), 'no-underscore-at-end')
  .refine(v => !v.includes('__'), 'no-consecutive-underscores');
