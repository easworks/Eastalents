import { DateTime } from 'luxon';
import { IdpCredential } from 'models/identity-provider';
import { PermissionRecord } from 'models/permission-record';
import { User } from 'models/user';
import { authValidators } from 'models/validators/auth';
import { SignupEmailInUse, SignupRequiresWorkEmail } from 'server-side/errors/definitions';
import { setTypeVersion } from 'server-side/mongodb/collections';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { easMongo } from '../mongodb';
import { getExternalUserForSignup, passwordUtils, sendVerificationEmail } from './utils';

export const authHandlers: FastifyZodPluginAsync = async server => {

  const publicEmailProviderCache = new PublicEmailProviderCache();

  server.route({
    method: 'POST',
    url: '/signup/email',
    schema: {
      body: authValidators.inputs.signup.email
    },
    handler: async (req) => {

      const input = req.body;

      await validateEmailCanSignup(input.email, input.role);

      const pwd = passwordUtils.generate(input.password);

      const user: User = {
        _id: null as unknown as string,
        email: input.email,

        firstName: input.firstName,
        lastName: input.lastName,
        nickname: input.nickname,

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

      await validateEmailCanSignup(externalUser.email, input.role)
        .catch(e => {
          if (e instanceof SignupRequiresWorkEmail) {
            e.metadata['prefill'] = {
              firstName: externalUser.firstName,
              lastName: externalUser.lastName,
            };
          }
          throw e;
        });

      const user: User = {
        _id: null as unknown as string,
        email: externalUser.email,

        firstName: externalUser.firstName,
        lastName: externalUser.lastName,
        nickname: input.nickname,

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

      return true;
    }
  });

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


  async function validateEmailCanSignup(email: string, role: string) {
    const emailExists = await easMongo.userCredentials.findOne({
      'provider.email': email
    });

    if (emailExists)
      throw new SignupEmailInUse();

    if (role === 'employer') {
      const domain = email.split('@')[1];
      if (await publicEmailProviderCache.has(domain))
        throw new SignupRequiresWorkEmail(domain);
    }
  }

};

class PublicEmailProviderCache {
  private _data = new Set<string>();
  private updatedOn: DateTime | null = null;

  async has(domain: string) {
    if (!this.updatedOn || this.updatedOn.diffNow('minutes').minutes < -5)
      await this.fetch();

    return this._data.has(domain);
  }

  private async fetch() {
    const data = await easMongo.keyval.get<string[]>('public-email-providers');

    if (!data)
      throw new Error('could not load public-email-providers from mongodb');

    this._data = new Set(data.value);
    this.updatedOn = DateTime.now();
  }
}
