import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { TokenRef } from 'models/auth';
import { ExternalIdpUser } from 'models/identity-provider';
import { OAuthTokenSuccessResponse } from 'models/oauth';
import { User } from 'models/user';
import * as crypto from 'node:crypto';
import { InvalidPassword, UserNeedsPasswordReset } from 'server-side/errors/definitions';
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
  createToken: async (user: User, roles: string[]) => {
    const { privateKey, issuer } = environment.jwt;
    const expiresIn = TOKEN_EXPIRY_SECONDS;

    const tokenRef: TokenRef = {
      _id: null as unknown as string,
      expiresIn
    };
    await easMongo.tokens.insertOne(tokenRef);

    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      email: user.email,
      imageUrl: user.imageUrl,
      roles
    };

    const token = await new Promise<string>((resolve, reject) => {
      jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn,
        jwtid: tokenRef._id.toString(),
        issuer,
        subject: user._id.toString()
      }, (err, encoded) => err ? reject(err) : resolve(encoded!));
    });

    return { token, expiresIn };

  }
} as const;

export const oauthUtils = {
  createTokenResponse: async (user: User, roles: string[]) => {
    const { token, expiresIn } = await jwtUtils.createToken(user, roles);

    const tokenResponse: OAuthTokenSuccessResponse = {
      // oauth spec properties
      access_token: token,
      expires_in: expiresIn,
      token_type: 'bearer',

      // custom properties
      user: {
        _id: user._id,
        email: user.email,
        verified: user.verified,

        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        imageUrl: user.imageUrl,
        roles
      }
    };

    return tokenResponse;
  },
} as const;


export async function sendVerificationEmail(user: User) {
  // TODO: implement
  // throw new Error(`email verification is not implemented : ${user.email}`);
}

export const getExternalUserForSignup = {
  google: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from google is not implemented`);

    const externalUser: ExternalIdpUser = {
      email: 'email@gmail.com',
      providerId: 'google-user-id',
      firstName: 'firstName',
      lastName: 'lastName',
      imageUrl: 'google-profile-image-url'
    };

    return externalUser;
  },
  facebook: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from facebook is not implemented`);

    const externalUser: ExternalIdpUser = {
      email: 'email@email.facebook',
      providerId: 'facebook-user-id',
      firstName: 'firstName',
      lastName: 'lastName',
      imageUrl: 'facebook-profile-image-url'
    };

    return externalUser;
  },
  github: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from github is not implemented`);

    const externalUser: ExternalIdpUser = {
      email: 'email@email.github',
      providerId: 'github-user-id',
      firstName: 'firstName',
      lastName: 'lastName',
      imageUrl: 'github-profile-image-url'
    };

    return externalUser;
  },
  linkedin: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from linkedin is not implemented`);

    const externalUser: ExternalIdpUser = {
      email: 'email@email.linkedin',
      providerId: 'linkedin-user-id',
      firstName: 'firstName',
      lastName: 'lastName',
      imageUrl: 'linkedin-profile-image-url'
    };

    return externalUser;
  }
} as const;

/**
 * 
 * @param email the email to check
 * @returns `false` if it is not a free email, the domain of the email otherwise
 */
export async function isFreeEmail(email: string) {
  const domain = email.split('@')[1];
  return await FreeEmailProviderCache.has(domain) ? domain : false;
}

export class FreeEmailProviderCache {
  private static _data = new Set<string>();
  private static updatedOn: DateTime | null = null;

  public static async has(domain: string) {
    if (!this.updatedOn || this.updatedOn.diffNow('minutes').minutes < -5)
      await this.fetch();

    return this._data.has(domain);
  }

  private static async fetch() {
    const data = await easMongo.keyval.get<string[]>('free-email-providers');

    if (!data)
      throw new Error('could not load free-email-providers from mongodb');

    this._data = new Set(data.value);
    this.updatedOn = DateTime.now();
  }
}
