import { OAuthTokenSuccessResponse } from 'models/oauth';
import { TypeOf, z } from 'zod';
import { EXTERNAL_IDENTITY_PROVIDERS, ExternalIdpUser } from '../identity-provider';
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
  role: z.string().min(1).max(32),
  externalIdp: z.enum(EXTERNAL_IDENTITY_PROVIDERS),
  externalAccessToken: z.string().min(1).max(512)
};

const inputs = {
  signup: z.strictObject({
    firstName: types.firstName,
    lastName: types.lastName,
    username: types.username,
    email: types.email,
    role: types.role,
    credentials: z.union([
      z.strictObject({
        provider: z.literal('email'),
        password: types.password
      }),
      z.strictObject({
        provider: types.externalIdp,
        accessToken: types.externalAccessToken
      })
    ])
  }),
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
  },
  validate: {
    usernameExists: z.strictObject({
      username: types.username
    })
  }
};

export const authValidators = { ...types, inputs } as const;

export type SignUpInput = TypeOf<typeof inputs['signup']>;

export type EmailSignInInput = TypeOf<typeof inputs['signin']['email']>;

export type SocialOAuthCodeExchange = TypeOf<typeof inputs['social']['codeExchange']>;

export type SocialOAuthCodeExchangeOutput =
  {
    result: 'sign-in',
    data: OAuthTokenSuccessResponse;
  } |
  {
    result: 'sign-up',
    data: ExternalIdpUser;
  };

export type SignUpOutput =
  {
    action: 'sign-in',
    data: OAuthTokenSuccessResponse,
  } |
  {
    action: 'verify-email';
  };

export type ValidateUsernameExistsInput = TypeOf<typeof inputs['validate']['usernameExists']>;