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

    const token = await new Promise<string>((resolve, reject) => {
      jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn,
        jwtid: tokenRef._id,
        issuer,
        subject: payload._id,
      }, (err, encoded) => err ? reject(err) : resolve(encoded as string));
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
    return await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token, publicKey, { issuer },
        (err, decoded) => err ? reject(err) : resolve(decoded as JwtPayload)
      );
    });
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


export async function sendVerificationEmail(user: User) {
  // TODO: implement
  // throw new Error(`email verification is not implemented : ${user.email}`);
}

export const getExternalUserForSignup = {
  google: {
    withCode: async (code: string, redirect_uri: string) => {
      const accessToken = await externalUtils.google.getAccessToken(code, redirect_uri);
      return getExternalUserForSignup.google.withToken(accessToken);
    },
    withToken: async (accessToken: string) => {
      const profile = await externalUtils.google.getProfile(accessToken);

      const externalUser: ExternalIdpUser = {
        providerId: profile.id,
        email: profile.email,
        email_verified: profile.verified_email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        imageUrl: profile.picture,
        credential: accessToken
      };

      return externalUser;
    }
  },
  github: {
    withCode: async (code: string, redirect_uri: string) => {
      // TODO: implement
      throw new Error(`getting user from github is not implemented`);
      const accessToken = '';
      return getExternalUserForSignup.github.withToken(accessToken);
    },
    withToken: async (accessToken: string) => {
      // TODO: implement
      throw new Error(`getting user from github is not implemented`);

      const externalUser: ExternalIdpUser = {
        email: 'email@email.github',
        email_verified: false,
        providerId: 'github-user-id',
        firstName: 'firstName',
        lastName: 'lastName',
        imageUrl: 'github-profile-image-url',
        credential: ''
      };

      return externalUser;
    }
  },
  linkedin: {
    withCode: async (code: string, redirect_uri: string) => {
      // TODO: implement
      throw new Error(`getting user from linkedin is not implemented`);
      const accessToken = '';
      return getExternalUserForSignup.github.withToken(accessToken);
    },
    withToken: async (accessToken: string) => {
      // TODO: implement
      throw new Error(`getting user from linkedin is not implemented`);

      const externalUser: ExternalIdpUser = {
        email: 'email@email.linkedin',
        email_verified: false,
        providerId: 'linkedin-user-id',
        firstName: 'firstName',
        lastName: 'lastName',
        imageUrl: 'linkedin-profile-image-url',
        credential: ''
      };

      return externalUser;
    }
  },
} as const;

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

const externalUtils = {
  google: {
    getAccessToken: async (code: string, redirect_uri: string) => {
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
    },
    getProfile: async (accessToken: string) => {
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
} as const;

export function createCredentialFromExternalUser(
  provider: ExternalIdentityProviderType,
  userId: IdpCredential['userId'],
  externalUser: ExternalIdpUser
): IdpCredential {
  return {
    _id: new ObjectId().toString(),
    userId,
    credential: externalUser.credential,
    provider: {
      type: provider,
      email: externalUser.email,
      id: externalUser.providerId
    },
  };
}


