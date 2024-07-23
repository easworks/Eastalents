import { User } from 'models/user';
import * as crypto from 'node:crypto';
import { InvalidPassword, UserNeedsPasswordReset } from 'server-side/errors/definitions';

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
};


export async function sendVerificationEmail(user: User) {
  // TODO: implement
  // throw new Error(`email verification is not implemented : ${user.email}`);
}

export const getExternalUserForSignup = {
  google: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from google is not implemented`);

    const email = 'email@email.google';
    const providerId = 'google-user-id';
    const credential = 'google-token';

    const firstName = 'firstName';
    const lastName = 'lastName';

    return { email, firstName, lastName, providerId, credential };
  },
  facebook: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from facebook is not implemented`);

    const email = 'email@email.facebook';
    const providerId = 'facebook-user-id';
    const credential = 'facebook-token';

    const firstName = 'firstName';
    const lastName = 'lastName';

    return { email, firstName, lastName, providerId, credential };
  },
  github: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from github is not implemented`);

    const email = 'email@email.github';
    const providerId = 'github-user-id';
    const credential = 'github-token';

    const firstName = 'firstName';
    const lastName = 'lastName';

    return { email, firstName, lastName, providerId, credential };
  },
  linkedin: (code: string) => {
    // TODO: implement
    // throw new Error(`getting user from linkedin is not implemented`);

    const email = 'email@email.linkedin';
    const providerId = 'linkedin-user-id';
    const credential = 'linkedin-token';

    const firstName = 'firstName';
    const lastName = 'lastName';

    return { email, firstName, lastName, providerId, credential };
  }
} as const;
