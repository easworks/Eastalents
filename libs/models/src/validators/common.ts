import { pattern } from '../pattern';
import { z } from 'zod';

export const objectId = z.string().trim()
  .length(24)
  .regex(pattern.hex.lowercase);