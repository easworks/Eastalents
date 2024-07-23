import { TypeOf, z } from 'zod';
import { ALLOWED_IDENTITY_PROVIDERS } from '../identity-provider';

const types = {
  firstName: z.string().trim().min(1).max(24),
  lastName: z.string().trim().min(1).max(24),
  nickName: z.string().trim().min(1).max(24),
  email: z.string().trim().max(64).email(),
  password: z.string().min(8).max(64), // don't trim, because user may want space
  role: z.enum(['talent', 'employer']),
  socialIdp: z.enum(ALLOWED_IDENTITY_PROVIDERS)
    .exclude(['email'])
};

const inputs = {
  signup: {
    email: z.strictObject({
      firstName: types.firstName,
      lastName: types.lastName,
      nickName: types.nickName,
      email: types.email,
      role: types.role,
      password: types.password,
    }),
    social: z.strictObject({
      firstName: types.firstName,
      lastName: types.lastName,
      nickName: types.nickName,
      email: types.email,
      role: types.role,
      idp: types.socialIdp
    })
  }
};

export const authValidators = { ...types, inputs } as const;

export type EmailSignupInput = TypeOf<typeof inputs['signup']['email']>;