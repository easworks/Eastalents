import { z } from 'zod';
import { objectId } from './common';
import { pattern } from '../pattern';

const types = {
  client_id: objectId,
  response_type: z.literal('code'),
  grant_type: z.literal('authorization_code'),
  redirect_uri: z.string().trim().max(128),
  state: z.string().max(1024),
  scope: z.string().trim()
    .transform(s => s
      .split(' ')
      .map(s => s.trim())
      .filter(s => !!s)
    ),
  grantCode: {
    external: z.string().trim().min(1),
    easworks: z.string().trim()
      // since we generate 64 random bytes,
      // the base64url encoded string will
      // always be of 86 characters
      .length(86)
      .regex(pattern.base64.urlSafe),
  },
  code_challenge: z.string().trim()
    .min(43).max(128)
    .regex(pattern.base64.urlSafe),
  code_challenge_method: z.enum(['S256', 'plain']).default('plain'),
};


const inputs = {
  authorize: {
    client_id: types.client_id,
    redirect_uri: types.redirect_uri.optional(),
    response_type: types.response_type,
    scope: types.scope.optional(),
    state: types.state.optional(),
    pkce: z.strictObject({
      method: types.code_challenge_method,
      code: types.code_challenge
    })
  },
  token: {
    client_id: types.client_id,
    grant_type: types.grant_type,
    code: types.grantCode.easworks,
    redirect_uri: types.redirect_uri.optional(),
    code_verifier: types.code_challenge.optional()
  }
} as const;

export const oauthValidators = { ...types, inputs } as const;

interface StandardOAuth2AuthorizationInput {
  client_id: string;
  redirect_uri?: string;
  response_type: 'code',
  scope?: string;
  state?: string;
};

interface PkceOAuth2AuthorizationInput extends StandardOAuth2AuthorizationInput {
  code_challenge: string;
  code_challenge_method: 'plain' | 'S256';
}

export type OAuth2AuthorizationInput =
  StandardOAuth2AuthorizationInput |
  PkceOAuth2AuthorizationInput;



// kept for posterity

// const inputs = {
//   authorize: (() => {
//     const standardAuthorization = z.strictObject({
//       response_type: types.response_type,
//       client_id: types.client_id,
//       redirect_uri: types.redirect_uri.optional(),
//       scope: types.scope.optional(),
//       state: types.state.optional(),
//     });

//     const pkceAuthorization = standardAuthorization.extend({
//       code_challenge_method: types.code_challenge_method,
//       code_challenge: types.code_challenge
//     });

//     return z.union([standardAuthorization, pkceAuthorization] as const);
//   })(),
//   token: (() => {
//     const standardAuthorization = z.strictObject({
//       client_id: types.client_id,
//       grant_type: types.grant_type,
//       code: types.grantCode.easworks,
//       redirect_uri: types.redirect_uri.optional(),
//     });

//     const pkceAuthorization = standardAuthorization.extend({
//       code_verifier: types.code_challenge
//     });

//     return z.union([standardAuthorization, pkceAuthorization] as const);
//   })()
// };
