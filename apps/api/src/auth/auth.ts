import { IdpCredential } from 'models/identity-provider';
import { PermissionRecord } from 'models/permission-record';
import { User } from 'models/user';
import { authValidators } from 'models/validators/auth';
import { SignupEmailInUse } from 'server-side/errors/definitions';
import { setTypeVersion } from 'server-side/mongodb/collections';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { easMongo } from '../mongodb';
import { passwordUtils, sendVerificationEmail } from './utils';

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
        enabled: true,
        firstName: input.firstName,
        lastName: input.lastName,
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


      await easMongo.users.insertOne(user);

      credential.userId = user._id;
      permissions._id = user._id;

      await easMongo.userCredentials.insertOne(credential);
      await easMongo.permissions.insertOne(permissions);

      await sendVerificationEmail(server, user);

      return true;
    }
  });

};
