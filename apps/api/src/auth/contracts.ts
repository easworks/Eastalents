import { z } from 'zod';

const codePattern = /^[a-zA-Z0-9]*$/;

const client_id = z.string().trim()
  .length(32)
  .regex(codePattern);

export const oauthContracts = {
  inputs: {
    authorize: z.object({
      response_type: z.literal('code'),
      client_id,
      redirect_uri: z.string().trim().max(128),
      state: z.string().max(1024).optional(),
      scope: z.string().trim()
        .transform(s => s.split(' ').map(s => s.trim()))
    })
  }
} as const;