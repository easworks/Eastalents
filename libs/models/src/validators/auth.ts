import { OAuthTokenSuccessResponse } from 'models/oauth';
import { pattern } from 'models/pattern';
import { TypeOf, z } from 'zod';
import { EXTERNAL_IDENTITY_PROVIDERS } from '../identity-provider';
import { username } from './common';
import { oauthValidators } from './oauth';

const types = {
  firstName: z.string().trim().min(1).max(24),
  lastName: z.string().trim().min(1).max(24),
  email: z.string().trim().max(64).email(),
  password: z.string().min(8).max(64), // don't trim, because user may want space
  role: z.string().min(1).max(32),
  externalIdp: z.enum(EXTERNAL_IDENTITY_PROVIDERS),
  externalUserStateToken: z.string().min(1).max(2048),
  verficationCode: z.string().trim()
    .length(8)
    .regex(pattern.otp.number)
};

const inputs = {
  signup: z.strictObject({
    firstName: types.firstName,
    lastName: types.lastName,
    username: username.prefixed,
    email: types.email,
    role: types.role,
    credentials: z.union([
      z.strictObject({
        provider: z.literal('email'),
        password: types.password
      }),
      z.strictObject({
        provider: types.externalIdp,
        token: types.externalUserStateToken
      })
    ]),
    clientId: oauthValidators.client_id.nullish()
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
  emailVerification: {
    sendCode: z.strictObject({
      pkce: z.strictObject({
        method: oauthValidators.code_challenge_method,
        code: oauthValidators.code_challenge
      }),
      email: types.email,
      firstName: types.firstName
    }),
    verifyEmail: z.strictObject({
      email: types.email,
      code: types.verficationCode,
      code_verifier: oauthValidators.code_challenge
    })
  },
  validate: {
    username: z.strictObject({
      username: username.prefixed
    }),
    email: z.strictObject({
      email: types.email
    })
  }
};

export const authValidators = { ...types, inputs } as const;

export type SignUpInput = TypeOf<typeof inputs['signup']>;

export type EmailSignInInput = TypeOf<typeof inputs['signin']['email']>;

export type SocialOAuthCodeExchange = TypeOf<typeof inputs['social']['codeExchange']>;

export type SocialOAuthCodeExchangeOutput =
  {
    action: 'sign-in',
    data: OAuthTokenSuccessResponse;
  } |
  {
    action: 'sign-up',
    data: string;
  } |
  {
    action: 'verify-email';
    domain: string;
  };

export type SignUpOutput =
  {
    action: 'sign-in',
    data: OAuthTokenSuccessResponse,
  } |
  {
    action: 'verify-email';
    domain: string;
  };

export type ValidateUsernameInput = TypeOf<typeof inputs['validate']['username']>;
export type ValidateEmailInput = TypeOf<typeof inputs['validate']['email']>;

export type SendEmailVerificationCodeInput = TypeOf<typeof inputs['emailVerification']['sendCode']>;
export type VerifyEmailInput = TypeOf<typeof inputs['emailVerification']['sendCode']>;