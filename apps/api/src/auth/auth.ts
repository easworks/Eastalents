import { ExternalIdentityProviderType, ExternalIdpUser, IdpCredential } from 'models/identity-provider';
import { PermissionRecord } from 'models/permission-record';
import { ALL_ROLES, PERMISSION_DEF_DTO } from 'models/permissions';
import { User } from 'models/user';
import { authValidators } from 'models/validators/auth';
import { ObjectId } from 'mongodb';
import { SignupEmailInUse, SignupRequiresWorkEmail, SignupRoleIsInvalid, UserEmailNotRegistered, UserIsDisabled, UserNeedsEmailVerification, UserNeedsPasswordReset, UserNicknameInUse } from 'server-side/errors/definitions';
import { setTypeVersion } from 'server-side/mongodb/collections';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { easMongo } from '../mongodb';
import { FreeEmailProviderCache, getExternalUserForSignup, isFreeEmail, jwtUtils, oauthUtils, passwordUtils, sendVerificationEmail } from './utils';
import { OAuthTokenSuccessResponse } from 'models/oauth';

export const authHandlers: FastifyZodPluginAsync = async server => {

  await FreeEmailProviderCache.check();

  server.get('/permission-definition', async () => PERMISSION_DEF_DTO);

  server.post('/signup/email',
    { schema: { body: authValidators.inputs.signup.email } },
    async (req) => {

      const input = req.body;

      // validate role
      {
        const role = ALL_ROLES.get(input.role);
        if (!role || !role.allowSignup)
          throw new SignupRoleIsInvalid();
      }

      // validate email
      const emailExists = await easMongo.userCredentials.findOne({ 'provider.email': input.email });

      if (emailExists)
        throw new SignupEmailInUse();

      if (input.role === 'employer') {
        const freeEmailDomain = await isFreeEmail(input.email);
        if (freeEmailDomain)
          throw new SignupRequiresWorkEmail(freeEmailDomain);
      }

      // validate nickname
      const nicknameExists = await easMongo.users.findOne({ nickname: input.nickname });
      if (nicknameExists)
        throw new UserNicknameInUse();

      // create user
      const user: User = {
        _id: new ObjectId().toString(),
        email: input.email,

        firstName: input.firstName,
        lastName: input.lastName,
        nickname: input.nickname,
        imageUrl: null,

        enabled: true,
        verified: false,
      };
      setTypeVersion(user, 'users');

      const credential: IdpCredential = {
        _id: new ObjectId().toString(),
        provider: {
          type: 'email',
          email: input.email,
          id: input.email,
        },
        userId: user._id,
        credential: passwordUtils.generate(input.password)
      };

      const permissions: PermissionRecord = {
        _id: user._id,
        permissions: [],
        roles: [input.role]
      };

      await saveNewUser(user, permissions, credential);

      // send verification link
      await sendVerificationEmail(user);

      return true;
    }
  );

  server.post('/signup/social',
    { schema: { body: authValidators.inputs.signup.social } },
    async (req) => {
      const input = req.body;

      // validate role
      {
        const role = ALL_ROLES.get(input.role);
        if (!role || !role.allowSignup)
          throw new SignupRoleIsInvalid();
      }

      // validate the grant code
      const externalUser = await getExternalUserForSignup[input.idp](input.code);

      // sign in the user if already exists
      // if user email not registered, continue
      // for any other error, stop
      const signInExistingUser = await signInExternalUser(externalUser, input.idp)
        .catch(e => {
          if (e instanceof UserEmailNotRegistered)
            return null;
          throw e;
        });
      if (signInExistingUser) {
        return signInExistingUser;
      }

      // validate the email
      if (input.role === 'employer') {
        const freeEmailDomain = await isFreeEmail(externalUser.email);
        if (freeEmailDomain)
          throw new SignupRequiresWorkEmail(freeEmailDomain)
            .withMetadata('prefill', {
              firstName: externalUser.firstName,
              lastName: externalUser.lastName,
            });
      }

      // validate nickname
      const nicknameExists = await easMongo.users.findOne({ nickname: input.nickname });
      if (nicknameExists)
        throw new UserNicknameInUse();


      // create user
      const user: User = {
        _id: new ObjectId().toString(),
        email: externalUser.email,

        firstName: externalUser.firstName,
        lastName: externalUser.lastName,
        imageUrl: externalUser.imageUrl,
        nickname: input.nickname,

        enabled: true,
        verified: true,
      };
      setTypeVersion(user, 'users');

      const credential: IdpCredential = {
        _id: new ObjectId().toString(),
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

      const accessToken = await jwtUtils.createToken('first-party', user, permissions);

      const response: OAuthTokenSuccessResponse = {
        access_token: accessToken.token,
        expires_in: accessToken.expiresIn,
        token_type: 'bearer',
        ...oauthUtils.getSuccessProps(user, permissions)
      };

      return response;
    }
  );

  server.post('/signin/email',
    {
      schema: { body: authValidators.inputs.signin.email }
    },
    async (req) => {
      const input = req.body;
      const credentials = await easMongo.userCredentials.find({
        'provider.email': input.email
      }).toArray();

      if (credentials.length === 0)
        throw new UserEmailNotRegistered();

      const emailCred = credentials.find(cred => cred.provider.type === 'email');

      if (!emailCred || !emailCred.credential)
        throw new UserNeedsPasswordReset();

      passwordUtils.validate(input.password, emailCred.credential);

      const user = await easMongo.users.findOne({ _id: emailCred.userId });
      if (!user)
        throw new Error('user should exist');

      if (!user.verified) {
        await sendVerificationEmail(user);
        throw new UserNeedsEmailVerification();
      }

      if (!user.enabled) {
        throw new UserIsDisabled();
      }

      const permissions = await easMongo.permissions.findOne({ _id: emailCred.userId });

      if (!permissions)
        throw new Error('user permissions should exist');

      const accessToken = await jwtUtils.createToken('first-party', user, permissions);

      const response: OAuthTokenSuccessResponse = {
        access_token: accessToken.token,
        expires_in: accessToken.expiresIn,
        token_type: 'bearer',
        ...oauthUtils.getSuccessProps(user, permissions)
      };

      return response;
    }
  );

  server.post('/signin/social',
    { schema: { body: authValidators.inputs.signin.social } },
    async (req) => {
      const input = req.body;

      // validate the grant code
      const externalUser = await getExternalUserForSignup[input.idp](input.code);

      // sign in the user if already exists
      return signInExternalUser(externalUser, input.idp);
    }
  );

  server.post('/verify-email',
    async () => {
      // TODO: implement
      throw new Error('not implemented');
    }
  );

  server.post('/reset-password',
    async () => {
      // TODO: implement
      throw new Error('not implemented');
    }
  );

  async function signInExternalUser(external: ExternalIdpUser, idp: ExternalIdentityProviderType) {

    const credentialExists = await easMongo.userCredentials.find({ 'provider.email': external.email }).toArray();

    if (!credentialExists.length)
      throw new UserEmailNotRegistered();

    // since it is an external user, we have 'verified' the user as well
    const user = await easMongo.users.findOneAndUpdate({ _id: credentialExists[0].userId }, { $set: { verified: true } });
    if (!user)
      throw new Error('user should not have been null');

    if (!user.enabled) {
      throw new UserIsDisabled();
    }

    // create a new credential for the idp if does not exist
    const hasSameIdp = credentialExists.find(cred => cred.provider.type === idp);
    if (!hasSameIdp) {
      const credential: IdpCredential = {
        _id: new ObjectId().toString(),
        provider: {
          type: idp,
          id: external.providerId,
          email: external.email,
        },
        userId: user._id,
        credential: external.credential
      };
      await easMongo.userCredentials.insertOne(credential);
    }

    const permissions = await easMongo.permissions.findOne({ _id: user._id });
    if (!permissions)
      throw new Error('user permissions should not be null');

    const accessToken = await jwtUtils.createToken('first-party', user, permissions);

    const response: OAuthTokenSuccessResponse = {
      access_token: accessToken.token,
      expires_in: accessToken.expiresIn,
      token_type: 'bearer',
      ...oauthUtils.getSuccessProps(user, permissions)
    };

    return response;
  }

  async function saveNewUser(
    user: User,
    permissions: PermissionRecord,
    credential: IdpCredential
  ) {
    await easMongo.users.insertOne(user);
    await easMongo.userCredentials.insertOne(credential);
    await easMongo.permissions.insertOne(permissions);
  }
};

