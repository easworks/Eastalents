import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { StatusCodes } from 'http-status-codes';
import { ALL_ROLES } from 'models/permissions';
import { CloudUser } from 'server-side/context';
import { InvalidBearerToken, UserIsDisabled, UserNotFound } from 'server-side/errors/definitions';
import { jwtUtils } from './auth/utils';
import { easMongo } from './mongodb';


const pluginImpl: FastifyPluginAsync = async server => {

  server.decorateRequest('ctx', null);

  server.addHook('onRequest', async (req) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    const user = token ? await mapTokenToCloudUser(token) : null;

    req.ctx.auth = user;
  });
};

export const useCloudContext = fastifyPlugin(pluginImpl);

async function mapTokenToCloudUser(token: string) {
  const claims = await jwtUtils.validateToken(token)
    .catch(e => {
      throw new InvalidBearerToken(e.message);
    });

  const tokenRef = await easMongo.tokens.findOne({ _id: claims.jti });
  if (!tokenRef)
    throw new InvalidBearerToken('expired');

  const user = await easMongo.users.findOne({ _id: claims['_id'] });
  if (!user)
    throw new UserNotFound().withStatus(StatusCodes.UNAUTHORIZED);

  if (!user.enabled)
    throw new UserIsDisabled();

  const permissionRecord = await easMongo.permissions.findOne({ _id: user._id });
  if (!permissionRecord)
    throw new Error('permissions document should exist');

  const roles = new Set(permissionRecord.roles);
  const permissions = getPermissionSet(permissionRecord.roles, permissionRecord.permissions);

  const auth: CloudUser = {
    _id: user._id,
    roles,
    permissions,
    token,
    claims
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