import { ALL_ROLES } from '@easworks/models/permissions';
import { buildConfig } from '@easworks/mongodb/mikro-orm.config';
import { token_ref_schema } from '@easworks/mongodb/schema/auth';
import { permission_record_schema } from '@easworks/mongodb/schema/permission-record';
import { user_schema } from '@easworks/mongodb/schema/user';
import { EAS_EntityManager } from '@easworks/mongodb/types';
import { MikroORM } from '@mikro-orm/mongodb';
import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { StatusCodes } from 'http-status-codes';
import { CloudContext, CloudUser } from 'server-side/context';
import { InvalidBearerToken, UserIsDisabled, UserNotFound } from 'server-side/errors/definitions';
import { jwtUtils } from './auth/utils';
import { environment } from './environment';

const pluginImpl: FastifyPluginAsync = async server => {
  server.decorate('orm', await MikroORM.init(buildConfig(environment.mongodb)));

  server.decorateRequest('ctx', null as unknown as CloudContext);

  server.addHook('onRequest', async (req) => {
    req.ctx = {
      auth: null,
      em: server.orm.em.fork()
    };

    const token = req.headers.authorization?.split('Bearer ')[1];
    const user = token ? await mapTokenToCloudUser(req.ctx.em, token) : null;

    req.ctx.auth = user;
  });
};

export const useCloudContext = fastifyPlugin(pluginImpl);

async function mapTokenToCloudUser(em: EAS_EntityManager, token: string) {
  const claims = await jwtUtils.validateToken(token)
    .catch(e => {
      throw new InvalidBearerToken(e.message);
    });

  const tokenRef = await em.findOne(token_ref_schema, claims.jti!);
  if (!tokenRef)
    throw new InvalidBearerToken('expired');

  const user = await em.findOne(user_schema, tokenRef.user);
  if (!user)
    throw new UserNotFound().withStatus(StatusCodes.UNAUTHORIZED);

  if (!user.enabled)
    throw new UserIsDisabled();

  const permissionRecord = await em.findOneOrFail(permission_record_schema, { user });

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