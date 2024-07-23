import { TypeOf, z } from 'zod';

const codePattern = /^[a-zA-Z0-9-._~]*$/;

const types = {
  client_id: z.string().trim()
    .length(32)
    .regex(codePattern),
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
      .min(1).max(32)
      .regex(codePattern),
  },
  code_challenge: z.string().trim()
    .min(43).max(128)
    .regex(codePattern),
  code_challenge_method: z.enum(['S256', 'plain']).default('plain'),
};



const inputs = {
  authorize: (() => {
    const standardAuthorization = z.strictObject({
      response_type: types.response_type,
      client_id: types.client_id,
      redirect_uri: types.redirect_uri.optional(),
      scope: types.scope.optional(),
      state: types.state.optional(),
    });

    const pkceAuthorization = standardAuthorization.extend({
      code_challenge_method: types.code_challenge_method,
      code_challenge: types.code_challenge
    });

    return z.union([standardAuthorization, pkceAuthorization] as const);
  })(),
  token: (() => {
    const standardAuthorization = z.strictObject({
      client_id: types.client_id,
      grant_type: types.grant_type,
      code: types.grantCode.easworks,
      redirect_uri: types.redirect_uri.optional(),
    });

    const pkceAuthorization = standardAuthorization.extend({
      code_verifier: types.code_challenge
    });

    return z.union([standardAuthorization, pkceAuthorization] as const);
  })()
};

export const oauthValidators = { ...types, inputs } as const;

export type OAuth2AuthorizationInput = TypeOf<typeof inputs['authorize']>;
