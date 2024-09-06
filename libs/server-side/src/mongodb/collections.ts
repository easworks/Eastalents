import { EmailVerificationCodeRef, PasswordResetCodeRef, TokenRef } from 'models/auth';
import { IdpCredential } from 'models/identity-provider';
import { OAuthClientApplication, OAuthCode } from 'models/oauth';
import { PermissionRecord } from 'models/permission-record';
import { User } from 'models/user';
import { Collection, MongoClient } from 'mongodb';

const collections = [
  'users'
] as const;
type collection = typeof collections[number];

const collectionMeta = {
  'users': '1.0.0'
} as const satisfies Record<collection, string>;

export type TypeVersioned<T, V extends string> = T & { _typeVersion: V; };

type KeyValDocument<T = unknown> = {
  key: string;
  value: T;
};

export function setTypeVersion<T extends object>(object: T, collection: collection):
  TypeVersioned<T, typeof collectionMeta[typeof collection]> {
  return Object.assign(object, { _typeVersion: collectionMeta[collection] });
}

export function initialiseMongo(client: MongoClient) {

  const db = client.db('easworks', { ignoreUndefined: true });
  const keyval = db.collection('keyval') as Collection<KeyValDocument>;

  return {
    client,
    db,

    users: db.collection('users') as Collection<User>,
    userCredentials: db.collection('user-credentials') as Collection<IdpCredential>,
    permissions: db.collection('permissions') as Collection<PermissionRecord>,

    tokens: db.collection('tokens') as Collection<TokenRef>,

    oauthApps: db.collection('oauth-apps') as Collection<OAuthClientApplication>,
    oauthCodes: db.collection('oauth-codes') as Collection<OAuthCode>,

    otp: {
      emailVerification: db.collection('otp-email-verification') as Collection<EmailVerificationCodeRef>,
      passwordReset: db.collection('password-reset-verification') as Collection<PasswordResetCodeRef>
    },

    keyval: {
      get: <T>(key: string) => (keyval as Collection<KeyValDocument<T>>).findOne({ key }),
      exists: (key: string) => keyval.countDocuments({ key }).then(count => count > 0)
    }
  };
}