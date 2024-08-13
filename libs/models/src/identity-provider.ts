import { Entity } from './entity';

export const EXTERNAL_IDENTITY_PROVIDERS = [
  'google',
  'facebook',
  'github',
  'linkedin'
] as const;

export type ExternalIdentityProviderType = typeof EXTERNAL_IDENTITY_PROVIDERS[number];

export const INTERNAL_IDENTITY_PROVIDERS = [
  'email'
] as const;
export type InternalIdentityProviderType = typeof INTERNAL_IDENTITY_PROVIDERS[number];

export const ALL_IDENTITY_PROVIDERS = [
  ...EXTERNAL_IDENTITY_PROVIDERS,
  ...INTERNAL_IDENTITY_PROVIDERS
] as const;

export type IdentityProviderType = typeof ALL_IDENTITY_PROVIDERS[number];

export interface IdpCredential extends Entity {
  provider: {
    type: IdentityProviderType;
    id: string;
    email: string;
  };
  userId: string;
  credential?: string;
}

export interface ExternalIdpUser {
  email: string;
  email_verified: boolean;
  firstName: string;
  lastName: string;
  imageUrl: string;

  providerId: string;
  credential: string;
}