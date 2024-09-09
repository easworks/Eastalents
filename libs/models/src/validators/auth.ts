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
    username: username,
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
    clientId: oauthValidators.client_id.nullish(),
    emailVerification: z.strictObject({
      code: types.verficationCode,
      code_verifier: oauthValidators.code_challenge
    }).nullable(),
    profileData: z.strictObject({
      domains: z.array(z.string().trim()),
      softwareProducts: z.array(z.string().trim()),
    })
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
      pkce: oauthValidators.code_challenge,
      email: types.email,
      firstName: types.firstName
    }),
    verifyCode: z.strictObject({
      email: types.email,
      code: types.verficationCode,
      code_verifier: oauthValidators.code_challenge
    })
  },
  passwordReset: (() => {
    const verifyCode = z.strictObject({
      email: types.email,
      code: types.verficationCode,
      code_verifier: oauthValidators.code_challenge
    });

    const setPassword = verifyCode.extend({
      password: types.password
    });

    return {
      sendCode: z.strictObject({
        pkce: oauthValidators.code_challenge,
        email: types.email,
      }),
      verifyCode,
      setPassword
    };
  })(),
  validate: {
    username: z.strictObject({
      username: username
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
  };

export type SignUpOutput =
  {
    action: 'sign-in',
    data: OAuthTokenSuccessResponse,
  };

export type ValidateUsernameInput = TypeOf<typeof inputs['validate']['username']>;
export type ValidateEmailInput = TypeOf<typeof inputs['validate']['email']>;

export type SendEmailVerificationCodeInput = TypeOf<typeof inputs['emailVerification']['sendCode']>;
export type VerifyEmailVerificationCodeInput = TypeOf<typeof inputs['emailVerification']['verifyCode']>;

export type SendPasswordResetVerificationCodeInput = TypeOf<typeof inputs['passwordReset']['sendCode']>;
export type VerifyPasswordResetVerificationCodeInput = TypeOf<typeof inputs['passwordReset']['verifyCode']>;
export type PasswordResetInput = TypeOf<typeof inputs['passwordReset']['setPassword']>;