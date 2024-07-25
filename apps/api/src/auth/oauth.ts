import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { oauthValidators } from 'models/validators/oauth';
import { OAuthRequestError } from 'server-side/errors/definitions';
import { ZodError } from 'zod';
import { environment } from '../environment';
import { easMongo } from '../mongodb';
import { OAuthAuthorizeErrorType } from 'models/oauth';

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
    { schema: { body: oauthValidators.inputs.authorize } },
    async () => {
      // 
    }
  );


  server.get('/token',
    async () => {
      throw new Error('not implemented');
    });


  const allowedParameters = {
    authorize: new Set([
      'client_id',
      'redirect_uri',
      'response_type',
      'scope',
      'state',
      'code_challenge',
      'code_challenge_method'
    ])
  };

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

    // if redirect_uri provided, check it is registered with client
    if (redirect_uri) {
      if (!clientApp.redirectUris.includes(redirect_uri))
        throw new OAuthRequestError('invalid-redirect-uri');
    }
    // else take the default redirect_uri from database
    else {
      if (!clientApp.redirectUris.length)
        throw new OAuthRequestError('invalid-redirect-uri');
      redirect_uri = clientApp.redirectUris[0];
    }

    // check that only known keys are in the request
    if (Object.keys(input).some(key => !allowedParameters.authorize.has(key)))
      throw new OAuthRequestError('invalid_request', redirect_uri);

    // check the response_type is valid
    const response_type = await validators.response_type.parseAsync(input['response_type'])
      .catch((e: ZodError) => {
        console.log(e.issues);
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

    // check pkce parameters if provided
    let pkce;
    {
      const has = {
        challenge: 'code_challenge' in input,
        method: 'code_challenge_method' in input,
      };

      if (has.method && has.challenge) {
        pkce = await validators.pkce.parseAsync({
          code_challenge: input['code_challenge'],
          code_challenge_method: input['code_challenge_method']
        });
      }
      else if (has.method || has.challenge)
        throw new OAuthRequestError('invalid_request');
    }

    return {
      client_id,
      redirect_uri,
      response_type,
      scopes,
      pkce
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