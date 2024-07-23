import { TypeOf, z } from 'zod';
import { ALLOWED_IDENTITY_PROVIDERS } from '../identity-provider';
import { pattern } from '../pattern';
import { oauthValidators } from './oauth';

const types = {
  firstName: z.string().trim().min(1).max(24),
  lastName: z.string().trim().min(1).max(24),
  nickname: z.string().trim().min(1).max(24)
    .regex(pattern.nickname)
    .refine(value => !(value.startsWith('_') || value.endsWith('_')), `should not start or end with '_'`),
  email: z.string().trim().max(64).email(),
  password: z.string().min(8).max(64), // don't trim, because user may want space
  role: z.enum(['talent', 'employer']),
  socialIdp: z.enum(ALLOWED_IDENTITY_PROVIDERS)
    .exclude(['email']),
};

const inputs = {
  signup: {
    email: z.strictObject({
      firstName: types.firstName,
      lastName: types.lastName,
      nickname: types.nickname,
      email: types.email,
      role: types.role,
      password: types.password,
    }),
    social: z.strictObject({
      code: oauthValidators.grantCode.external,
      idp: types.socialIdp,
      role: types.role,
      nickname: types.nickname
    })
  }
};

export const authValidators = { ...types, inputs } as const;

export type EmailSignupInput = TypeOf<typeof inputs['signup']['email']>;

export type SocialSignupInput = TypeOf<typeof inputs['signup']['social']>;