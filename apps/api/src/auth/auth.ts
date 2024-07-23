import { IdpCredential } from 'models/identity-provider';
import { PermissionRecord } from 'models/permission-record';
import { MAGIC_UNSET_NICKNAME, User } from 'models/user';
import { authValidators } from 'models/validators/auth';
import { SignupEmailInUse } from 'server-side/errors/definitions';
import { setTypeVersion } from 'server-side/mongodb/collections';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { easMongo } from '../mongodb';
import { getExternalUserForSignup, passwordUtils, sendVerificationEmail } from './utils';

export const authHandlers: FastifyZodPluginAsync = async server => {

  server.route({
    method: 'POST',
    url: '/signup/email',
    schema: {
      body: authValidators.inputs.signup.email
    },
    handler: async (req) => {

      const input = req.body;

      const emailExists = await easMongo.userCredentials.findOne({
        'provider.email': input.email
      });

      if (emailExists)
        throw new SignupEmailInUse();

      const pwd = passwordUtils.generate(input.password);

      const user: User = {
        _id: null as unknown as string,
        email: input.email,

        firstName: input.firstName,
        lastName: input.lastName,
        nickName: input.nickName,

        enabled: true,
        verified: false,
      };
      setTypeVersion(user, 'users');

      const credential: IdpCredential = {
        _id: null as unknown as string,
        provider: {
          type: 'email',
          email: input.email,
          id: input.email,
        },
        userId: user._id,
        credential: pwd
      };

      const permissions: PermissionRecord = {
        _id: user._id,
        permissions: [],
        roles: [input.role]
      };

      await saveNewUser(user, permissions, credential);

      await sendVerificationEmail(user);

      return true;
    }
  });

  server.route({
    method: 'POST',
    url: '/signup/social',
    schema: { body: authValidators.inputs.signup.social },
    handler: async (req) => {
      const input = req.body;

      const externalUser = getExternalUserForSignup[input.idp](input.code);


      const user: User = {
        _id: null as unknown as string,
        email: externalUser.email,

        firstName: externalUser.firstName,
        lastName: externalUser.lastName,
        nickName: MAGIC_UNSET_NICKNAME,

        enabled: true,
        verified: true,
      };
      setTypeVersion(user, 'users');

      const credential: IdpCredential = {
        _id: null as unknown as string,
        provider: {
          type: input.idp,
          email: externalUser.email,
          id: externalUser.providerId
        },
        userId: user._id,
        credential: externalUser.credential
      };

      const permissions: PermissionRecord = {
        _id: user._id,
        permissions: [],
        roles: [input.role]
      };

      await saveNewUser(user, permissions, credential);

      return user;
    }
  });

};

async function saveNewUser(
  user: User,
  permissions: PermissionRecord,
  credential: IdpCredential
) {
  await easMongo.users.insertOne(user);

  credential.userId = user._id;
  permissions._id = user._id;

  await easMongo.userCredentials.insertOne(credential);
  await easMongo.permissions.insertOne(permissions);
}