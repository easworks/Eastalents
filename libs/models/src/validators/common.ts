import { pattern } from '../pattern';
import { z } from 'zod';

export const objectId = z.string().trim()
  .length(24)
  .regex(pattern.hex.lowercase);

export const username = z.string().trim().min(1).max(24)
  .regex(/^@[a-z0-9_]+$/)
  .refine(value => !(value.startsWith('@_') || value.endsWith('_')), `no-underscore-at-ends`)
  .refine(value => !value.includes('__'), `no-consecutive-underscores`);