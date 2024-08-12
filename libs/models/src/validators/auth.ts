import { OAuthTokenSuccessResponse } from 'models/oauth';
import { TypeOf, z } from 'zod';
import { EXTERNAL_IDENTITY_PROVIDERS } from '../identity-provider';
import { pattern } from '../pattern';
import { oauthValidators } from './oauth';

const types = {
  firstName: z.string().trim().min(1).max(24),
  lastName: z.string().trim().min(1).max(24),
  username: z.string().trim().min(1).max(24)
    .regex(pattern.username)
    .refine(value => !(value.startsWith('_') || value.endsWith('_')), `should not start or end with '_'`),
  email: z.string().trim().max(64).email(),
  password: z.string().min(8).max(64), // don't trim, because user may want space
  role: z.enum(['talent', 'employer']),
  externalIdp: z.enum(EXTERNAL_IDENTITY_PROVIDERS)
};

const inputs = {
  signup: {
    email: z.strictObject({
      firstName: types.firstName,
      lastName: types.lastName,
      username: types.username,
      email: types.email,
      role: types.role,
      password: types.password,
    })
  },
  signin: {
    email: z.strictObject({
      email: types.email,
      password: types.password
    })
  },
  social: {
    codeExchange: z.strictObject({
      idp: types.externalIdp,
      code: oauthValidators.grantCode.external,
      redirect_uri: oauthValidators.redirect_uri
    })
  }
};

export const authValidators = { ...types, inputs } as const;

export type EmailSignupInput = TypeOf<typeof inputs['signup']['email']>;

export type EmailSignInInput = TypeOf<typeof inputs['signin']['email']>;

export type SocialOAuthCodeExchange = TypeOf<typeof inputs['social']['codeExchange']>;

export type SocialOAuthCodeExchangeOutput =
  {
    result: 'sign-in',
    data: OAuthTokenSuccessResponse;
  } |
  {
    result: 'sign-up',
    accessToken: string;
  };