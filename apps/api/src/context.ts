import { fastifyRequestContext } from '@fastify/request-context';
import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { StatusCodes } from 'http-status-codes';
import { ALL_ROLES } from 'models/permissions';
import { CloudContext, CloudUser } from 'server-side/context';
import { InvalidBearerToken, UserIsDisabled, UserNeedsEmailVerification, UserNotFound } from 'server-side/errors/definitions';
import { jwtUtils } from './auth/utils';
import { easMongo } from './mongodb';

export const CLOUD_CONTEXT_KEY = 'cloudContext';

declare module '@fastify/request-context' {
  interface RequestContextData {
    [CLOUD_CONTEXT_KEY]?: CloudContext;
  }
}

const pluginImpl: FastifyPluginAsync = async server => {
  server.register(fastifyRequestContext, {
    hook: 'onRequest',
    defaultStoreValues: {}
  });

  server.addHook('onRequest', async (req) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    const auth = token ? await mapTokenToCloudUser(token) : null;

    const context: CloudContext = {
      auth,
    };

    req.requestContext.set(CLOUD_CONTEXT_KEY, context);

  });
};

export const useCloudContext = fastifyPlugin(pluginImpl);

async function mapTokenToCloudUser(token: string) {
  const claims = await jwtUtils.validateToken(token)
    .catch(e => {
      throw new InvalidBearerToken(e.message);
    });

  const user = await easMongo.users.findOne({ _id: claims['sub'] });
  if (!user)
    throw new UserNotFound().withStatus(StatusCodes.UNAUTHORIZED);

  if (!user.enabled)
    throw new UserIsDisabled();

  if (!user.verified)
    throw new UserNeedsEmailVerification();

  const permissionRecord = await easMongo.permissions.findOne({ _id: user._id });
  if (!permissionRecord)
    throw new Error('permissions document should exist');

  const roles = new Set(permissionRecord.roles);
  const permissions = getPermissionSet(permissionRecord.roles, permissionRecord.permissions);

  const auth: CloudUser = {
    ...claims,
    _id: user._id,
    roles,
    permissions,
    token,
  };

  return auth;
}

function getPermissionSet(roles: string[], permissions: string[]) {
  const permissionSet = new Set<string>();

  permissions.forEach(p => permissionSet.add(p));
  roles.forEach(roleId =>
    ALL_ROLES.get(roleId)?.permissions.forEach(p =>
      permissionSet.add(p))
  );

  return permissionSet;

}