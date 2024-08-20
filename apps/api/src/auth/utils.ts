import jwt, { JwtPayload } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { TokenRef } from 'models/auth';
import { ExternalIdentityProviderType, ExternalIdpUser, IdpCredential } from 'models/identity-provider';
import { PermissionRecord } from 'models/permission-record';
import { User, UserClaims } from 'models/user';
import { ObjectId } from 'mongodb';
import * as crypto from 'node:crypto';
import { FailedSocialProfileRequest, InvalidPassword, InvalidSocialOauthCode, KeyValueDocumentNotFound, UserNeedsPasswordReset } from 'server-side/errors/definitions';
import { environment } from '../environment';
import { easMongo } from '../mongodb';
import '../utils/email';
import { EmailSender } from '../utils/email';

const TOKEN_EXPIRY_SECONDS = 60 * 60; // 1 hour

export const passwordUtils = {
  sizes: {
    salt: 16,
    hash: 64,
  },
  generate: (plainText: string) => {
    const salt = crypto.randomBytes(passwordUtils.sizes.salt);
    const saltText = salt.toString('hex');

    const plain = Buffer.from(plainText, 'utf-8');

    const hash = crypto.pbkdf2Sync(plain, salt, 1000, passwordUtils.sizes.hash, 'sha512');
    const hashText = hash.toString('hex');

    return `${saltText}${hashText}`;
  },
  validate: (input: string, credential: string) => {
    const expectedLength = (passwordUtils.sizes.salt + passwordUtils.sizes.hash) * 2;
    if (credential.length !== expectedLength)
      throw new UserNeedsPasswordReset();

    const split = passwordUtils.sizes.salt * 2;
    const saltText = credential.substring(0, split);
    const hashText = credential.substring(split);

    const salt = Buffer.from(saltText, 'hex');
    const plain = Buffer.from(input, 'utf-8');
    const hash = crypto.pbkdf2Sync(plain, salt, 1000, passwordUtils.sizes.hash, 'sha512');

    if (hashText !== hash.toString('hex'))
      throw new InvalidPassword();
  }
} as const;

export const jwtUtils = {
  createToken: async (
    type: 'first-party' | 'third-party',
    user: User,
    permissionRecord: PermissionRecord) => {
    const { privateKey, issuer } = environment.jwt;
    const expiresIn = TOKEN_EXPIRY_SECONDS;

    const tokenRef: TokenRef = {
      _id: new ObjectId().toString(),
      expiresIn,
      userId: user._id,
    };

    const payload: UserClaims = type === 'first-party' ?
      {
        type,
        _id: user._id,
        permissions: permissionRecord.permissions,
        roles: permissionRecord.roles
      } :
      {
        type,
        _id: user._id,
        roles: permissionRecord.roles
      };

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn,
      jwtid: tokenRef._id,
      issuer,
      subject: payload._id,
    });
    await easMongo.tokens.insertOne(tokenRef);

    return {
      tid: tokenRef._id,
      token,
      expiresIn
    };

  },
  validateToken: async (token: string) => {
    const { issuer, publicKey } = environment.jwt;
    return jwt.verify(token, publicKey, { issuer }) as JwtPayload;
  }
} as const;

export const oauthUtils = {
  getSuccessProps: (user: User, permissionRecord: PermissionRecord) => {
    return {
      user: {
        _id: user._id,
        email: user.email,
        verified: user.verified,
        username: user.username,

        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        imageUrl: user.imageUrl,
        roles: permissionRecord.roles
      }
    };
  }
} as const;


export class EmailVerification {

  private static readonly generateCode = (() => {
    const min = 10 ** 7;
    const max = 10 ** 8;

    return () => {
      const num = crypto.randomInt(min, max);
      return num.toString();
    };
  })();

  private static createLink(code: string) {
    const url = new URL(`${environment.authHost.host}${environment.authHost.authActionHandler}`);
    // const url = new URL(`https://accounts.easworks.com${environment.authHost.authActionHandler}`);
    url.searchParams.set('action', 'verify-email-address');
    url.searchParams.set('code', code);

    return url.toString();
  }

  public static async send(user: User) {
    const code = this.generateCode();

    // TODO: store code;

    const link = this.createLink(code);

    const compose = await EmailSender.compose.verifyEmail(user, code, link);

    return EmailSender.sendEmail(compose, environment.gmail.support.id);
  }
}

export class WelcomeEmail {
  public static async send(user: User, permission: PermissionRecord, oauthClientName?: string) {

    let raw;
    {
      switch (oauthClientName) {
        case 'easdevhub-production':
          raw = await EmailSender.compose.welcome.easdevhub(user);
          break;
        default:
          if (permission.roles.includes('employer'))
            raw = await EmailSender.compose.welcome.easworks.employer(user);
          else
            raw = await EmailSender.compose.welcome.easworks.talent(user);
          break;
      }
    }

    return EmailSender.sendEmail(raw, environment.gmail.support.id);
  }
}

/**
 * 
 * @param email the email to check
 * @returns `false` if it is not a free email, the domain of the email otherwise
 */
export async function isFreeEmail(email: string) {
  const domain = email.split('@')[1];
  if (
    domain === 'mailinator.com' &&
    (environment.id === 'local' || environment.id === 'development')
  )
    return false;
  return await FreeEmailProviderCache.has(domain) ? domain : false;
}

export class FreeEmailProviderCache {
  private static readonly docKey = 'free-email-providers';
  private static _data = new Set<string>();
  private static updatedOn: DateTime | null = null;

  public static async has(domain: string) {
    if (this.isOld()) await this.fetch();

    return this._data.has(domain);
  }

  private static isOld() {
    // if it was never fetched or if 5 minutes hasve passes since last fetch
    return !this.updatedOn ||
      this.updatedOn.diffNow('minutes').minutes < -5;
  }

  private static async fetch() {
    const data = await easMongo.keyval.get<string[]>(this.docKey);

    if (!data)
      throw new Error('could not load free-email-providers from mongodb');

    this._data = new Set(data.value);
    this.updatedOn = DateTime.now();
  }

  static async check() {
    if (!(await easMongo.keyval.exists(this.docKey))) {
      throw new KeyValueDocumentNotFound(this.docKey);
    }
  }
}

export function createCredentialFromExternalUser(
  provider: ExternalIdentityProviderType,
  userId: IdpCredential['userId'],
  externalUser: ExternalIdpUser
): IdpCredential {
  return {
    _id: new ObjectId().toString(),
    userId,
    provider: {
      type: provider,
      email: externalUser.email,
      id: externalUser.providerId
    },
  };
}

class GoogleUtils {

  public static readonly getExternalUser = {
    withCode: async (code: string, redirect_uri: string) => {
      const accessToken = await this.getAccessToken(code, redirect_uri);
      return this.getExternalUser.withToken(accessToken);
    },
    withToken: async (accessToken: string) => {
      const profile = await this.getProfile(accessToken);

      const externalUser: ExternalIdpUser = {
        providerId: profile.id,
        email: profile.email,
        email_verified: profile.verified_email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        imageUrl: profile.picture,
      };

      return externalUser;
    }
  } as const;

  private static async getAccessToken(code: string, redirect_uri: string) {
    const config = environment.oauth.google;

    const params = new URLSearchParams();
    params.set('client_id', config.id);
    params.set('client_secret', config.secret);
    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri', redirect_uri);
    params.set('code', code);

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: params.toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });

    if (res.ok) {
      const body = await res.json() as any;

      return body.access_token as string;
    }
    else {
      const body = await res.json();
      throw new InvalidSocialOauthCode('google', body);
    }
  }

  private static async getProfile(accessToken: string) {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    });

    if (res.ok) {
      const body = await res.json() as any;

      return body;
    }
    else {
      const body = await res.json();
      throw new FailedSocialProfileRequest('google', body);
    }
  }
}

class LinkedinUtils {

  public static readonly getExternalUser = {
    withCode: async (code: string, redirect_uri: string) => {
      const accessToken = await this.getAccessToken(code, redirect_uri);
      return this.getExternalUser.withToken(accessToken);
    },
    withToken: async (accessToken: string) => {
      const profile = await this.getProfile(accessToken);

      const externalUser: ExternalIdpUser = {
        providerId: profile.sub,
        email: profile.email,
        email_verified: profile.email_verified,
        firstName: profile.given_name,
        lastName: profile.family_name,
        imageUrl: profile.picture,
      };

      return externalUser;
    }
  } as const;

  private static async getAccessToken(code: string, redirect_uri: string) {
    const config = environment.oauth.linkedin;

    const params = new URLSearchParams();
    params.set('client_id', config.id);
    params.set('client_secret', config.secret);
    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri', redirect_uri);
    params.set('code', code);

    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      body: params.toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });

    if (res.ok) {
      const body = await res.json() as any;

      return body.access_token as string;
    }
    else {
      const body = await res.json();
      throw new InvalidSocialOauthCode('linkedin', body);
    }
  }

  private static async getProfile(accessToken: string) {

    const res = await fetch('https://api.linkedin.com/v2/userinfo', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    });

    if (res.ok) {
      const body = await res.json() as any;

      return body;
    }
    else {
      const body = await res.json();
      throw new FailedSocialProfileRequest('linkedin', body);
    }
  }

}

class GithubUtils {

  public static readonly getExternalUser = {
    withCode: async (code: string, redirect_uri: string) => {
      const accessToken = await this.getAccessToken(code, redirect_uri);
      return this.getExternalUser.withToken(accessToken);
    },
    withToken: async (accessToken: string) => {

      const [profile, emails] = await Promise.all([
        this.getProfile(accessToken),
        this.getEmails(accessToken)
      ]);

      let email;
      {
        email = emails.find(e => e.primary);
        if (!email)
          email = emails.find(e => e.verified);

        if (!email)
          email = emails[0];
      }

      const [firstName, lastName] = profile.name.split(' ');

      const externalUser: ExternalIdpUser = {
        providerId: profile.id,
        email: email.email,
        email_verified: email.verified,
        firstName,
        lastName,
        imageUrl: profile.avatar_url,
      };

      return externalUser;
    }
  } as const;

  private static async getAccessToken(code: string, redirect_uri: string) {
    const config = environment.oauth.github;

    const params = new URLSearchParams();
    params.set('client_id', config.id);
    params.set('client_secret', config.secret);
    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri', redirect_uri);
    params.set('code', code);

    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: params.toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      }
    });

    if (res.ok) {
      const body = await res.json() as any;
      return body.access_token as string;
    }
    else {
      const body = await res.text();
      throw new InvalidSocialOauthCode('github', body);
    }
  }

  private static async getProfile(accessToken: string) {
    const res = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    });

    if (res.ok) {
      const body = await res.json() as any;
      return body;
    }
    else {
      const body = await res.text();
      throw new FailedSocialProfileRequest('github', body);
    }
  }

  private static async getEmails(accessToken: string) {
    const res = await fetch('https://api.github.com/user/emails', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    });

    if (res.ok) {
      const body = await res.json() as {
        email: string,
        primary: true,
        verified: true,
      }[];


      return body;
    }
    else {
      const body = await res.text();
      throw new FailedSocialProfileRequest('github', body);
    }
  }

}

export class ExternalUserTransfer {
  public static async toToken(provider: ExternalIdentityProviderType, externalUser: ExternalIdpUser) {
    const payload = {
      type: 'state:ExternalIdpUser',
      provider,
      externalUser,
      isFreeEmail: await isFreeEmail(externalUser.email)
    };

    const { privateKey, issuer } = environment.jwt;
    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      issuer
    });

    return token;
  }

  public static fromToken(provider: ExternalIdentityProviderType, token: string) {
    const { issuer, publicKey } = environment.jwt;
    const payload = jwt.verify(token, publicKey, { issuer }) as JwtPayload;
    if (payload['type'] !== 'state:ExternalIdpUser')
      throw new Error('state token type mismatch');
    if (payload['provider'] !== provider)
      throw new Error('identity provider mismatch');

    return payload['externalUser'] as ExternalIdpUser;
  }
}

export const getExternalUserForSignup = {
  google: GoogleUtils.getExternalUser,
  linkedin: LinkedinUtils.getExternalUser,
  github: GithubUtils.getExternalUser
} as const;
