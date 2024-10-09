import { TypeOf, z } from 'zod';
import { datetime } from './common';

const inputs = {
  getData: z.strictObject({
    version: datetime.optional(),
  })
};

export const domainValidators = { inputs } as const;

export type GetDomainDataInput = TypeOf<typeof inputs['getData']>;