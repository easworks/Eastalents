import jwt from 'jsonwebtoken';
import { TokenRef } from 'models/auth';
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
  addPropertiesToResponse: (user: User, response: OAuthTokenSuccessResponse) => {
    Object.assign(response, {
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        username: user.nickname,
        email: user.email,
        email_verified: user.verified,
        avatar: user.imageUrl,
      }
    });
  },
  createToken: async (user: User, roles: string[]) => {
    const { privateKey, issuer } = environment.jwt;
    const expiresIn = TOKEN_EXPIRY_SECONDS;

    const tokenRef: TokenRef = {
      _id: user._id,
      expiresIn
    };
    await easMongo.tokens.insertOne(tokenRef);

    const payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname
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


export async function sendVerificationEmail(user: User) {
  // TODO: implement
  // throw new Error(`email verification is not implemented : ${user.email}`);
}

interface ExternalUser {
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;

  providerId: string;
  credential: string;

}

export const getExternalUserForSignup = {
  google: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from google is not implemented`);

    const externalUser: ExternalUser = {
      email: 'email@email.google',
      providerId: 'google-user-id',
      credential: 'google-token',
      firstName: 'firstName',
      lastName: 'lastName',
      imageUrl: 'google-profile-image-url'
    };

    return externalUser;
  },
  facebook: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from facebook is not implemented`);

    const externalUser: ExternalUser = {
      email: 'email@email.facebook',
      providerId: 'facebook-user-id',
      credential: 'facebook-token',
      firstName: 'firstName',
      lastName: 'lastName',
      imageUrl: 'facebook-profile-image-url'
    };

    return externalUser;
  },
  github: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from github is not implemented`);

    const externalUser: ExternalUser = {
      email: 'email@email.github',
      providerId: 'github-user-id',
      credential: 'github-token',
      firstName: 'firstName',
      lastName: 'lastName',
      imageUrl: 'github-profile-image-url'
    };

    return externalUser;
  },
  linkedin: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from linkedin is not implemented`);

    const externalUser: ExternalUser = {
      email: 'email@email.linkedin',
      providerId: 'linkedin-user-id',
      credential: 'linkedin-token',
      firstName: 'firstName',
      lastName: 'lastName',
      imageUrl: 'linkedin-profile-image-url'
    };

    return externalUser;
  }
} as const;
