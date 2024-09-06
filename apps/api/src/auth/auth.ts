import { EmailVerificationCodeRef, PasswordResetCodeRef } from 'models/auth';
import { ExternalIdentityProviderType, ExternalIdpUser, IdpCredential } from 'models/identity-provider';
import { OAuthTokenSuccessResponse } from 'models/oauth';
import { PermissionRecord } from 'models/permission-record';
import { ALL_ROLES, PERMISSION_DEF_DTO } from 'models/permissions';
import { User } from 'models/user';
import { authValidators, SignUpOutput, SocialOAuthCodeExchangeOutput } from 'models/validators/auth';
import { ObjectId } from 'mongodb';
import { EmailVerificationCodeExpired, SignupEmailInUse, SignupRequiresWorkEmail, SignupRoleIsInvalid, UserEmailNotRegistered, UserIsDisabled, UsernameInUse, UserNeedsPasswordReset } from 'server-side/errors/definitions';
import { setTypeVersion } from 'server-side/mongodb/collections';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { easMongo } from '../mongodb';
import { createCredentialFromExternalUser, EmailVerification, ExternalUserTransfer, FreeEmailProviderCache, getExternalUserForSignup, isFreeEmail, jwtUtils, oauthUtils, PasswordReset, passwordUtils, WelcomeEmail } from './utils';

// TODO: add transactions to all the methods

const EMAIL_VERIFICATION_EXPIRY_SECONDS = 300;
const PASSWORD_RESET_EXPIRY_SECONDS = 300;

export const authHandlers: FastifyZodPluginAsync = async server => {

  await FreeEmailProviderCache.check();

  server.get('/permission-definition', async () => PERMISSION_DEF_DTO);

  server.post('/signup',
    { schema: { body: authValidators.inputs.signup } },
    async (req) => {

      const input = req.body;

      let externalUser: ExternalIdpUser | undefined;
      if (input.credentials.provider !== 'email') {
        externalUser = ExternalUserTransfer.fromToken(input.credentials.provider, input.credentials.token);

        try {
          // get token if user already exists
          const tokenResponse = await trySignInExternalUser(externalUser, input.credentials.provider);
          return {
            action: 'sign-in',
            data: tokenResponse
          } satisfies SignUpOutput;
        }
        catch (e) {
          if (e instanceof UserEmailNotRegistered) undefined;

          else throw e;
        }
      }

      // validate email
      // - if externalUser has a value, 
      //   then we have a guarantee that
      //   email doe not exist, because `trySignInExternalUser`
      //   would have checked for the existence of the email
      const emailExists = externalUser ?
        false :
        await easMongo.userCredentials.findOne({ 'provider.email': input.email });

      if (emailExists)
        throw new SignupEmailInUse();

      if (!externalUser || !externalUser.email_verified) {
        if (!input.emailVerification)
          throw new EmailVerificationCodeExpired();

        // verify the email
        const ref = await easMongo.otp.emailVerification.findOne({ email: input.email });
        await EmailVerification.verify(ref, input.emailVerification.code, input.emailVerification.code_verifier);
      }

      // validate role
      {
        const role = ALL_ROLES.get(input.role);
        if (!role || !role.allowSignup)
          throw new SignupRoleIsInvalid();
      }

      if (input.role === 'employer') {
        const freeEmailDomain = await isFreeEmail(input.email);
        if (freeEmailDomain)
          throw new SignupRequiresWorkEmail(freeEmailDomain);
      }

      // validate username
      const usernameExists = await easMongo.users.findOne({ username: input.username });
      if (usernameExists)
        throw new UsernameInUse();

      // create user
      const user: User = {
        _id: new ObjectId().toString(),
        email: input.email,

        firstName: input.firstName,
        lastName: input.lastName,
        username: input.username,
        imageUrl: null,

        enabled: true,
      };
      setTypeVersion(user, 'users');

      let credential: IdpCredential;
      if (input.credentials.provider === 'email') {
        credential = {
          _id: new ObjectId().toString(),
          provider: {
            type: 'email',
            email: input.email,
            id: input.email,
          },
          userId: user._id,
          credential: passwordUtils.generate(input.credentials.password)
        };
      }
      else {
        if (!externalUser)
          throw new Error('external user should not be null');
        credential = createCredentialFromExternalUser(
          input.credentials.provider as ExternalIdentityProviderType,
          user._id,
          externalUser
        );
      }

      const permissions: PermissionRecord = {
        _id: user._id,
        permissions: [],
        roles: [input.role]
      };

      await saveNewUser(user, permissions, credential);
      {
        let clientName;
        if (input.clientId) {
          const client = await easMongo.oauthApps.findOne({ _id: input.clientId });
          if (!client)
            throw new Error('invalid operation');
          clientName = client?.name;
        }
        await WelcomeEmail.send(user, permissions, clientName);
      }

      const accessToken = await jwtUtils.createToken('first-party', user, permissions);

      const response: OAuthTokenSuccessResponse = {
        access_token: accessToken.token,
        expires_in: accessToken.expiresIn,
        token_type: 'bearer',
        ...oauthUtils.getSuccessProps(user, permissions)
      };

      return {
        action: 'sign-in',
        data: response
      } satisfies SignUpOutput;
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

  server.post('/social/code-exchange',
    { schema: { body: authValidators.inputs.social.codeExchange } },
    async (req) => {
      const input = req.body;

      // validate the grant code
      const externalUser = await getExternalUserForSignup[input.idp]
        .withCode(input.code, input.redirect_uri);

      try {
        // get token if user already exists
        const tokenResponse = await trySignInExternalUser(externalUser, input.idp);
        return {
          action: 'sign-in',
          data: tokenResponse
        } satisfies SocialOAuthCodeExchangeOutput;
      }
      catch (e) {
        if (e instanceof UserEmailNotRegistered)
          return {
            action: 'sign-up',
            data: await ExternalUserTransfer.toToken(input.idp, externalUser)
          } satisfies SocialOAuthCodeExchangeOutput;

        else throw e;
      }
    }
  );

  server.post('/email-verification/send-code',
    { schema: { body: authValidators.inputs.emailVerification.sendCode } },
    async (req) => {
      const input = req.body;

      const code = EmailVerification.generateCode();

      const store: EmailVerificationCodeRef = {
        _id: null as unknown as string,
        expiresIn: EMAIL_VERIFICATION_EXPIRY_SECONDS,
        email: input.email,
        code,
        pkce: input.pkce
      };

      await easMongo.otp.emailVerification.replaceOne({ email: input.email }, store, { upsert: true });

      await EmailVerification.send(input.email, input.firstName, code);

      return true;
    }
  );

  server.post('/email-verification/verify-code',
    { schema: { body: authValidators.inputs.emailVerification.verifyCode } },
    async (req) => {
      const input = req.body;

      const ref = await easMongo.otp.emailVerification.findOne({ email: input.email });

      await EmailVerification.verify(ref, input.code, input.code_verifier);

      return true;
    }
  );

  server.post('/reset-password/send-code',
    { schema: { body: authValidators.inputs.passwordReset.sendCode } },
    async (req) => {
      const input = req.body;

      const cred = await easMongo.userCredentials.findOne({ 'provider.email': input.email });
      if (!cred)
        throw new UserEmailNotRegistered();

      const user = await easMongo.users.findOne({ _id: cred.userId });
      if (!user)
        throw new Error('invalid operation');

      const code = PasswordReset.generateCode();

      const store: PasswordResetCodeRef = {
        _id: user._id,
        expiresIn: PASSWORD_RESET_EXPIRY_SECONDS,
        email: input.email,
        code,
        pkce: input.pkce
      };

      await easMongo.otp.passwordReset.replaceOne({ _id: user._id }, store, { upsert: true });

      await PasswordReset.send(input.email, user.firstName, code);

      return true;
    }
  );

  server.post('/reset-password/verify-code',
    { schema: { body: authValidators.inputs.passwordReset.verifyCode } },
    async (req) => {
      const input = req.body;
      const ref = await easMongo.otp.passwordReset.findOne({ email: input.email });

      await PasswordReset.verify(ref, input.code, input.code_verifier);

      return true;
    }
  );

  server.post('/reset-password',
    { schema: { body: authValidators.inputs.passwordReset.setPassword } },
    async (req) => {
      const input = req.body;

      const ref = await easMongo.otp.passwordReset.findOne({ email: input.email });

      await PasswordReset.verify(ref, input.code, input.code_verifier);

      const user = await easMongo.users.findOne({ _id: ref!._id });

      if (!user)
        throw new Error('invalid operation');

      const credential: IdpCredential = {
        _id: new ObjectId().toString(),
        provider: {
          type: 'email',
          email: user.email,
          id: user.email
        },
        userId: user._id,
        credential: passwordUtils.generate(input.password)
      };

      await easMongo.userCredentials.replaceOne(
        { userId: user._id, 'provider.type': 'email' },
        credential,
        { upsert: true }
      );

      return true;
    }
  );

  server.post('/validate/username-exists',
    { schema: { body: authValidators.inputs.validate.username } },
    async (req) => {
      const { username } = req.body;
      const user = await easMongo.users.findOne({ username });
      if (user) return true;
      else return false;
    }
  );

  server.post('/validate/email-exists',
    { schema: { body: authValidators.inputs.validate.email } },
    async (req) => {
      const { email } = req.body;
      const cred = await easMongo.userCredentials.findOne({
        'provider.email': email
      });
      if (cred) return true;
      else return false;
    }
  );

  server.post('/validate/email-is-free',
    { schema: { body: authValidators.inputs.validate.email } },
    async (req) => isFreeEmail(req.body.email)
  );

  async function trySignInExternalUser(external: ExternalIdpUser, idp: ExternalIdentityProviderType) {

    // look for an exact match by external user id
    let credential = await easMongo.userCredentials.findOne({
      'provider.type': idp,
      'provider.id': external.providerId
    });

    if (!credential) {
      // look for loose match by email
      credential = await easMongo.userCredentials.findOne({
        'provider.email': external.email
      });

      // email was not present in our db
      if (!credential)
        throw new UserEmailNotRegistered();

      // we found the email was being used by a user
      const userId = credential.userId;

      // create a new credential for the same user
      // and add to database
      credential = {
        _id: new ObjectId().toString(),
        provider: {
          type: idp,
          id: external.providerId,
          email: external.email,
        },
        userId
      };
      await easMongo.userCredentials.insertOne(credential);
    }

    const user = await easMongo.users.findOne({ _id: credential.userId });
    if (!user)
      throw new Error('user should not have been null');

    if (!user.enabled) {
      throw new UserIsDisabled();
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

