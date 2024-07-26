import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { DateTime } from 'luxon';
import { OAuthAuthorizeErrorType, OAuthCode, oauthCodeGenerator } from 'models/oauth';
import { oauthValidators } from 'models/validators/oauth';
import { ObjectId } from 'mongodb';
import { AuthenticatedCloudContext } from 'server-side/context';
import { OAuthRequestError } from 'server-side/errors/definitions';
import { ZodError } from 'zod';
import { CLOUD_CONTEXT_KEY } from '../context';
import { environment } from '../environment';
import { easMongo } from '../mongodb';
import { authHook } from './hooks';

export const oauthHandlers: FastifyPluginAsync = async server => {

  const authHostHandler = `${environment.authHost.host}${environment.authHost.oauthHandler}`;

  server.get('/authorize',
    async (req, reply) => {
      const input = req.query as Record<string, string>;

      try {
        await validateAuthorizationInput(input);
      }
      catch (err) {
        if (err instanceof OAuthRequestError) {
          return sendAuthorizationError(err, reply);
        }
        throw err;
      }

      const qs = new URL(req.hostname + req.url).search;
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
    async (req) => {
      const rawInput = req.body as Record<string, string>;

      const ctx = req.requestContext.get(CLOUD_CONTEXT_KEY) as AuthenticatedCloudContext;

      const input = await validateAuthorizationInput(rawInput);

      const now = DateTime.now();

      const grantCode: OAuthCode = {
        _id: new ObjectId().toString(),
        value: oauthCodeGenerator(),
        clientId: input.client_id,
        userId: ctx.auth._id,
        expiresAt: now.plus({ minutes: 5 }),
        redirectUri: input.redirect_uri.was_provided ?
          input.redirect_uri.value :
          undefined,
        challenge: input.pkce
      };

      await easMongo.oauthCodes.insertOne(grantCode);

      const url = new URL(authHostHandler);
      url.searchParams.set('code', grantCode.value);
      if (input.state)
        url.searchParams.set('state', input.state);

      return url;
    }
  );


  server.get('/token',
    async () => {
      throw new Error('not implemented');
    });

  async function validateAuthorizationInput(input: Record<string, string>) {
    const validators = oauthValidators.inputs.authorize;

    // check if client_id is missing/malformed
    const client_id = await validators.client_id.parseAsync(input['client_id'])
      .catch(() => {
        throw new OAuthRequestError('invalid-client-id');
      });

    // check if client_id is in database 
    const clientApp = await easMongo.oauthApps.findOne({ _id: client_id });
    if (!clientApp)
      throw new OAuthRequestError('invalid-client-id');

    // check if redirect_uri is malformed if provided
    let redirect_uri = await validators.redirect_uri.optional().parseAsync(input['redirect_uri'])
      .catch(() => {
        throw new OAuthRequestError('invalid-client-id');
      });
    let redirect_uri_was_provided;

    // if redirect_uri provided, check it is registered with client
    if (redirect_uri) {
      if (!clientApp.redirectUris.includes(redirect_uri))
        throw new OAuthRequestError('invalid-redirect-uri');
      redirect_uri_was_provided = true;
    }
    // else take the default redirect_uri from database
    else {
      if (!clientApp.redirectUris.length)
        throw new OAuthRequestError('invalid-redirect-uri');
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
        throw new OAuthRequestError('invalid_scope', redirect_uri);
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