import { FirstPartyDomain } from '@easworks/models/user';
import { email_verification_code_ref_schema, password_reset_code_ref_schema } from '@easworks/mongodb/schema/auth';
import { employer_profile_schema, initialEmployerProfile } from '@easworks/mongodb/schema/employer-profile';
import { user_credential_schema } from '@easworks/mongodb/schema/identity-provider';
import { oauth_client_application_schema } from '@easworks/mongodb/schema/oauth';
import { permission_record_schema } from '@easworks/mongodb/schema/permission-record';
import { initialTalentProfile, talent_profile_schema } from '@easworks/mongodb/schema/talent-profile';
import { user_schema } from '@easworks/mongodb/schema/user';
import { EAS_EntityManager } from '@easworks/mongodb/types';
import { ObjectId } from '@mikro-orm/mongodb';
import { DateTime } from 'luxon';
import { ExternalIdentityProviderType, ExternalIdpUser } from 'models/identity-provider';
import { OAuthTokenSuccessResponse } from 'models/oauth';
import { ALL_ROLES, PERMISSION_DEF_DTO } from 'models/permissions';
import { authValidators, SignUpOutput, SocialOAuthCodeExchangeOutput } from 'models/validators/auth';
import { EmailVerificationCodeExpired, SignupEmailInUse, SignupRequiresWorkEmail, SignupRoleIsInvalid, UserEmailNotRegistered, UserIsDisabled, UsernameInUse, UserNeedsPasswordReset } from 'server-side/errors/definitions';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { createCredentialFromExternalUser, EmailVerification, ExternalUserTransfer, FreeEmailProviderCache, getExternalUserForSignup, isFreeEmail, jwtUtils, oauthUtils, PasswordReset, passwordUtils, WelcomeEmail } from './utils';

// TODO: add transactions to all the methods

const EMAIL_VERIFICATION_EXPIRY_SECONDS = 300;
const PASSWORD_RESET_EXPIRY_SECONDS = 300;

export const authHandlers: FastifyZodPluginAsync = async server => {

  await FreeEmailProviderCache.check(server.orm.em.fork());

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
          const tokenResponse = await trySignInExternalUser(req.ctx.em, externalUser, input.credentials.provider);
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
      //   email does not exist, because `trySignInExternalUser`
      //   would have checked for the existence of the email
      const emailExists = externalUser ?
        false :
        await req.ctx.em.findOne(user_credential_schema, { provider: { email: input.email } });

      if (emailExists)
        throw new SignupEmailInUse();

      if (!externalUser || !externalUser.email_verified) {
        if (!input.emailVerification)
          throw new EmailVerificationCodeExpired();

        // verify the email
        const ref = await req.ctx.em.findOne(email_verification_code_ref_schema, { email: input.email });
        await EmailVerification.verify(ref, input.emailVerification.code, input.emailVerification.code_verifier);
      }

      // validate role
      {
        const role = ALL_ROLES.get(input.role);
        if (!role || !role.allowSignup)
          throw new SignupRoleIsInvalid();
      }

      if (input.role === 'employer') {
        const freeEmailDomain = await isFreeEmail(req.ctx.em, input.email);
        if (freeEmailDomain)
          throw new SignupRequiresWorkEmail(freeEmailDomain);
      }

      let sourceDomain: FirstPartyDomain = 'easworks';
      {
        if (input.clientId) {
          const client = await req.ctx.em.findOneOrFail(oauth_client_application_schema, input.clientId);
          sourceDomain = client.firstPartyDomain || 'easworks';
        }
      }

      // validate username
      const usernameExists = await req.ctx.em.findOne(user_schema, { username: input.username });
      if (usernameExists)
        throw new UsernameInUse();

      // create user
      const user = req.ctx.em.create(user_schema, {
        _id: new ObjectId().toString(),
        email: input.email,

        firstName: input.firstName,
        lastName: input.lastName,
        username: input.username,
        imageUrl: null,

        enabled: true,
        sourceDomain
      });


      // create credential
      if (input.credentials.provider === 'email') {
        req.ctx.em.create(user_credential_schema, {
          _id: new ObjectId().toString(),
          provider: {
            type: 'email',
            email: input.email,
            id: input.email,
          },
          user,
          credential: passwordUtils.generate(input.credentials.password)
        });
      }
      else {
        if (!externalUser)
          throw new Error('external user should not be null');
        req.ctx.em.create(user_credential_schema, createCredentialFromExternalUser(
          input.credentials.provider,
          user,
          externalUser
        ));
      }

      // create permission record
      const permissions = req.ctx.em.create(permission_record_schema, {
        user,
        permissions: [],
        roles: [input.role]
      });

      // create profile
      switch (input.role) {
        case 'employer':
          req.ctx.em.create(employer_profile_schema, initialEmployerProfile(user, input.profileData));
          break;
        case 'talent':
          req.ctx.em.create(talent_profile_schema, initialTalentProfile(user, input.profileData));
          break;
        default: break;
      }

      await req.ctx.em.flush();

      await WelcomeEmail.send(user, permissions);

      const accessToken = await jwtUtils.createToken(req.ctx.em, 'first-party', user, permissions);

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
      const credentials = await req.ctx.em.find(
        user_credential_schema,
        { provider: { email: input.email } });


      if (credentials.length === 0)
        throw new UserEmailNotRegistered();

      const emailCred = credentials.find(cred => cred.provider.type === 'email');

      if (!emailCred || !emailCred.credential)
        throw new UserNeedsPasswordReset();

      passwordUtils.validate(input.password, emailCred.credential);

      const user = await req.ctx.em.findOneOrFail(user_schema, emailCred.user);

      if (!user.enabled) {
        throw new UserIsDisabled();
      }

      const permissions = await req.ctx.em.findOneOrFail(permission_record_schema, { user });

      const accessToken = await jwtUtils.createToken(req.ctx.em, 'first-party', user, permissions);

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
        const tokenResponse = await trySignInExternalUser(req.ctx.em, externalUser, input.idp);
        return {
          action: 'sign-in',
          data: tokenResponse
        } satisfies SocialOAuthCodeExchangeOutput;
      }
      catch (e) {
        if (e instanceof UserEmailNotRegistered)
          return {
            action: 'sign-up',
            data: await ExternalUserTransfer.toToken(req.ctx.em, input.idp, externalUser)
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
      const expiresAt = DateTime.now().plus({ seconds: EMAIL_VERIFICATION_EXPIRY_SECONDS });

      const old = await req.ctx.em.findOne(email_verification_code_ref_schema, { email: input.email });

      if (old) {
        old.expiresAt = expiresAt;
        old.code = code;
        old.pkce = input.pkce;
      }
      else {
        req.ctx.em.create(email_verification_code_ref_schema, {
          _id: new ObjectId().toString(),
          expiresAt,
          email: input.email,
          code,
          pkce: input.pkce
        });
      }

      await req.ctx.em.flush();

      let domain: FirstPartyDomain = 'easworks';
      {
        if (input.clientId) {
          const clientApp = await req.ctx.em.findOne(oauth_client_application_schema, input.clientId);
          if (clientApp)
            domain = clientApp.firstPartyDomain || 'easworks';
        }
      }

      await EmailVerification.send(input.email, input.firstName, code, domain);

      return true;
    }
  );

  server.post('/email-verification/verify-code',
    { schema: { body: authValidators.inputs.emailVerification.verifyCode } },
    async (req) => {
      const input = req.body;

      const ref = await req.ctx.em.findOne(email_verification_code_ref_schema, { email: input.email });

      await EmailVerification.verify(ref, input.code, input.code_verifier);

      return true;
    }
  );

  server.post('/reset-password/send-code',
    { schema: { body: authValidators.inputs.passwordReset.sendCode } },
    async (req) => {
      const input = req.body;

      const cred = await req.ctx.em.findOne(user_credential_schema, { provider: { email: input.email } });
      if (!cred)
        throw new UserEmailNotRegistered();

      const user = await req.ctx.em.findOneOrFail(user_schema, cred.user);

      const code = PasswordReset.generateCode();
      const expiresAt = DateTime.now().plus({ seconds: PASSWORD_RESET_EXPIRY_SECONDS });

      const old = await req.ctx.em.findOne(password_reset_code_ref_schema, user._id);
      if (old) {
        old.expiresAt = expiresAt;
        old.email = input.email;
        old.code = code;
        old.pkce = input.pkce;
      }
      else {
        req.ctx.em.create(password_reset_code_ref_schema, {
          _id: user._id,
          expiresAt,
          email: input.email,
          code,
          pkce: input.pkce
        });
      }

      await req.ctx.em.flush();

      await PasswordReset.send(input.email, user, code);

      return true;
    }
  );

  server.post('/reset-password/verify-code',
    { schema: { body: authValidators.inputs.passwordReset.verifyCode } },
    async (req) => {
      const input = req.body;
      const ref = await req.ctx.em.findOne(password_reset_code_ref_schema, { email: input.email });

      await PasswordReset.verify(ref, input.code, input.code_verifier);

      return true;
    }
  );

  server.post('/reset-password',
    { schema: { body: authValidators.inputs.passwordReset.setPassword } },
    async (req) => {
      const input = req.body;

      const ref = await req.ctx.em.findOne(password_reset_code_ref_schema, { email: input.email });

      await PasswordReset.verify(ref, input.code, input.code_verifier);

      const user = await req.ctx.em.findOneOrFail(user_schema, { _id: ref!._id });

      const old = await req.ctx.em.findOne(user_credential_schema, { user, provider: { type: 'email' } });
      const passwordHash = passwordUtils.generate(input.password);

      if (old) {
        old.provider.email = user.email;
        old.provider.id = user.email;
        old.credential = passwordHash;
      }
      else {
        req.ctx.em.create(user_credential_schema, {
          _id: new ObjectId().toString(),
          provider: {
            type: 'email',
            email: user.email,
            id: user.email
          },
          user,
          credential: passwordHash
        });
      }

      await req.ctx.em.flush();

      return true;
    }
  );

  server.post('/validate/username-exists',
    { schema: { body: authValidators.inputs.validate.username } },
    async (req) => {
      const { username } = req.body;
      const user = await req.ctx.em.findOne(user_schema, { username });
      if (user) return true;
      else return false;
    }
  );

  server.post('/validate/email-exists',
    { schema: { body: authValidators.inputs.validate.email } },
    async (req) => {
      const { email } = req.body;
      const cred = await req.ctx.em.findOne(user_credential_schema, { provider: { email } });
      if (cred) return true;
      else return false;
    }
  );

  server.post('/validate/email-is-free',
    { schema: { body: authValidators.inputs.validate.email } },
    async (req) => isFreeEmail(req.ctx.em, req.body.email)
  );

  async function trySignInExternalUser(em: EAS_EntityManager, external: ExternalIdpUser, idp: ExternalIdentityProviderType) {

    // look for an exact match by external user id
    let credential = await em.findOne(user_credential_schema, {
      provider: {
        type: idp,
        id: external.providerId
      }
    });

    if (!credential) {
      // look for loose match by email
      credential = await em.findOne(user_credential_schema, {
        provider: { email: external.email }
      });

      // email was not present in our db
      if (!credential)
        throw new UserEmailNotRegistered();

      // we found the email was being used by a user
      const user = credential.user;

      // create a new credential for the same user
      // and add to database
      credential = em.create(user_credential_schema, createCredentialFromExternalUser(
        idp,
        user,
        external
      ));
      await em.flush();
    }

    const user = await em.findOneOrFail(user_schema, credential.user);

    if (!user.enabled) {
      throw new UserIsDisabled();
    }

    const permissions = await em.findOneOrFail(permission_record_schema, { user });

    const accessToken = await jwtUtils.createToken(em, 'first-party', user, permissions);

    const response: OAuthTokenSuccessResponse = {
      access_token: accessToken.token,
      expires_in: accessToken.expiresIn,
      token_type: 'bearer',
      ...oauthUtils.getSuccessProps(user, permissions)
    };

    return response;
  }
};
