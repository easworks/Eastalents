import { token_ref_schema } from '@easworks/mongodb/schema/auth';
import { oauth_client_application_schema, oauth_code_schema } from '@easworks/mongodb/schema/oauth';
import { permission_record_schema } from '@easworks/mongodb/schema/permission-record';
import { user_schema } from '@easworks/mongodb/schema/user';
import { EAS_EntityManager } from '@easworks/mongodb/types';
import { ObjectId } from '@mikro-orm/mongodb';
import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { DateTime } from 'luxon';
import { OAuthAuthorizeErrorType, OAuthTokenSuccessResponse } from 'models/oauth';
import { oauthValidators } from 'models/validators/oauth';
import { OAuthRequestError } from 'server-side/errors/definitions';
import { ZodError } from 'zod';
import { environment } from '../environment';
import { authHook } from './hooks';
import { jwtUtils, oauthUtils } from './utils';

export const oauthHandlers: FastifyPluginAsync = async server => {

  const authHostHandler = `${environment.authHost.host}${environment.authHost.oauthHandler}`;

  server.get('/authorize',
    async (req, reply) => {
      const input = req.query as Record<string, string>;

      try {
        await validateAuthorizationInput(req.ctx.em, input);
      }
      catch (err) {
        if (err instanceof OAuthRequestError) {
          return sendAuthorizationError(err, reply);
        }
        throw err;
      }

      const qs = new URLSearchParams(input).toString();
      const url = new URL(authHostHandler);
      url.search = qs;

      return reply.redirect(
        url.toString(),
        StatusCodes.SEE_OTHER
      );
    }
  );

  server.post('/authorize',
    { onRequest: authHook() },
    async (req, reply) => {
      const auth = req.ctx.auth!;
      const rawInput = req.body as Record<string, string>;

      let input;
      try {
        input = await validateAuthorizationInput(req.ctx.em, rawInput);
      }
      catch (err) {
        if (err instanceof OAuthRequestError) {
          return sendAuthorizationError(err, reply);
        }
        throw err;
      }

      const now = DateTime.now();

      const grantCode = req.ctx.em.create(oauth_code_schema, {
        _id: new ObjectId().toString(),
        value: generateRandomCode(),
        client: input.client_id,
        user: auth._id,
        expiresAt: now.plus({ minutes: 5 }),
        redirectUri: input.redirect_uri.was_provided ?
          input.redirect_uri.value :
          undefined,
        challenge: input.pkce,
        grantedTokens: []
      });

      req.ctx.em.flush();

      const url = new URL(input.redirect_uri.value);
      url.searchParams.set('code', grantCode.value);
      if (input.state)
        url.searchParams.set('state', input.state);

      return url;
    }
  );


  server.post('/token',
    async (req) => {
      const rawInput = req.body as Record<string, string>;

      const { clientApp, storedCode } = await validateTokenInput(req.ctx.em, rawInput);

      if (storedCode.grantedTokens.length > 0) {
        // token(s) were already issued against this code
        // delete those issued tokens
        storedCode.grantedTokens.forEach(tid => {
          const ref = req.ctx.em.getReference(token_ref_schema, tid);
          req.ctx.em.remove(ref);
        });
        await req.ctx.em.flush();

        // TODO: implement - notify the user about the security incident
        // const user = await easMongo.users.findOne({ _id: storedCode.userId });

        throw new OAuthRequestError('invalid_grant');
      }

      const user = await req.ctx.em.findOneOrFail(user_schema, storedCode.user);

      const permissionRecord = await req.ctx.em.findOneOrFail(permission_record_schema, { user });
      if (!permissionRecord)
        throw new Error('user permissions should exist');

      const accessToken = await jwtUtils.createToken(
        req.ctx.em,
        clientApp.firstParty ? 'first-party' : 'third-party',
        user,
        permissionRecord);

      storedCode.grantedTokens.push(accessToken.tid);
      await req.ctx.em.flush();

      const response: OAuthTokenSuccessResponse = {
        access_token: accessToken.token,
        expires_in: accessToken.expiresIn,
        token_type: 'bearer',
        ...oauthUtils.getSuccessProps(user, permissionRecord)
      };

      return response;

    });

  async function validateAuthorizationInput(em: EAS_EntityManager, input: Record<string, string>) {
    const validators = oauthValidators.inputs.authorize;

    // check if client_id is missing/malformed
    const client_id = await validators.client_id.parseAsync(input['client_id'])
      .catch(() => {
        throw new OAuthRequestError('invalid_request');
      });

    // check if client_id is in database 
    const clientApp = await em.findOne(oauth_client_application_schema, client_id);
    if (!clientApp)
      throw new OAuthRequestError('invalid_client_id');

    // check if redirect_uri is malformed if provided
    let redirect_uri = await validators.redirect_uri.optional().parseAsync(input['redirect_uri'])
      .catch(() => {
        throw new OAuthRequestError('invalid_request');
      });
    let redirect_uri_was_provided;

    // if redirect_uri provided, check it is registered with client
    if (redirect_uri) {
      if (!clientApp.redirectUris.includes(redirect_uri))
        throw new OAuthRequestError('invalid_redirect_uri');
      redirect_uri_was_provided = true;
    }
    // else take the default redirect_uri from database
    else {
      if (!clientApp.redirectUris.length)
        throw new OAuthRequestError('invalid_redirect_uri');
      redirect_uri = clientApp.redirectUris[0];
      redirect_uri_was_provided = false;
    }

    // check the response_type is valid
    const response_type = await validators.response_type.parseAsync(input['response_type'])
      .catch((e: ZodError) => {
        if (e.issues[0].code === 'invalid_literal')
          throw new OAuthRequestError('unsupported_response_type', redirect_uri);
        throw new OAuthRequestError('invalid_request', redirect_uri);
      });

    // check scopes
    const scopes = await validators.scope.parseAsync(input['scope'])
      .catch(() => {
        throw new OAuthRequestError('invalid_request', redirect_uri);
      });
    if (scopes && scopes.length)
      throw new OAuthRequestError('invalid_scope', redirect_uri);

    // check state
    const state = await validators.state.parseAsync(input['state'])
      .catch(() => {
        throw new OAuthRequestError('invalid_request', redirect_uri);
      });

    // check pkce parameters if provided
    let pkce;
    {
      const has = {
        challenge: 'code_challenge' in input,
        method: 'code_challenge_method' in input,
      };

      if (has.method && has.challenge) {
        pkce = await validators.pkce.parseAsync({
          code: input['code_challenge'],
          method: input['code_challenge_method']
        }).catch(() => {
          throw new OAuthRequestError('invalid_request', redirect_uri);
        });
      }
      else if (has.method || has.challenge)
        throw new OAuthRequestError('invalid_request', redirect_uri);
    }

    return {
      client_id,
      redirect_uri: {
        value: redirect_uri,
        was_provided: redirect_uri_was_provided
      },
      response_type,
      scopes,
      pkce,
      state
    };
  }

  async function validateTokenInput(em: EAS_EntityManager, input: Record<string, string>) {
    const validators = oauthValidators.inputs.token;

    // check if grant_type is valid
    await validators.grant_type.parseAsync(input['grant_type'])
      .catch((e: ZodError) => {
        if (e.issues[0].code === 'invalid_literal')
          throw new OAuthRequestError('unsupported_grant_type');
        throw new OAuthRequestError('invalid_request');
      });

    // check if code is valid
    const code = await validators.code.parseAsync(input['code'])
      .catch(() => {
        throw new OAuthRequestError('invalid_grant');
      });

    // check if client_id is valid
    const client_id = await validators.client_id.parseAsync(input['client_id'])
      .catch(() => {
        throw new OAuthRequestError('invalid_request');
      });

    // check if code exists in db
    const storedCode = await em.findOne(oauth_code_schema, { value: code });
    if (!storedCode)
      throw new OAuthRequestError('invalid_grant');

    // check if code is expired
    const expiry = DateTime.fromJSDate(storedCode.expiresAt as unknown as Date);
    if (expiry.diffNow().milliseconds < 0)
      throw new OAuthRequestError('invalid_grant');

    // check if client_id is same as in authorization request
    if (client_id !== storedCode.client._id)
      throw new OAuthRequestError('invalid_grant');

    const clientApp = await em.findOne(oauth_client_application_schema, client_id);
    if (!clientApp)
      throw new OAuthRequestError('invalid_client_id');

    // check if redirect_uri is valid
    const redirect_uri = await validators.redirect_uri.parseAsync(input['redirect_uri'])
      .catch(() => {
        throw new OAuthRequestError('invalid_request');
      });

    // check if redirect_uri matches authorization request
    if (storedCode.redirectUri !== redirect_uri) {
      throw new OAuthRequestError('invalid_grant');
    }

    // check if code_verifier is valid
    const verifier = await validators.code_verifier.parseAsync(input['code_verifier']);
    if (storedCode.challenge && verifier) {
      if (storedCode.challenge.method === 'plain') {
        if (storedCode.challenge.code !== verifier)
          throw new OAuthRequestError('invalid_grant');
      }
      else {
        const hash = await crypto.subtle.digest('SHA-256', Buffer.from(verifier, 'base64url'))
          .then(bytes => Buffer.from(bytes).toString('base64url'));
        if (storedCode.challenge.code !== hash)
          throw new OAuthRequestError('invalid_grant');

      }
    }
    else if (storedCode.challenge || verifier) {
      throw new OAuthRequestError('invalid_request');
    }

    return { storedCode, clientApp };
  }

  async function sendAuthorizationError(error: OAuthRequestError<OAuthAuthorizeErrorType>, reply: FastifyReply) {
    const redirect_uri = error.redirect_uri || authHostHandler;

    const url = new URL(redirect_uri);
    url.searchParams.set('error', error.error);

    return reply.redirect(
      url.toString(),
      StatusCodes.SEE_OTHER
    );
  }

};

function generateRandomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(64));
  return Buffer.from(bytes).toString('base64url');
}