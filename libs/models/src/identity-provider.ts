import { Entity } from './entity';

export const ALLOWED_IDENTITY_PROVIDERS = [
  'email',
  'google',
  'facebook',
  'github',
  'linkedin'
] as const;

export type IdentityProviderType = typeof ALLOWED_IDENTITY_PROVIDERS[number];

export interface IdpCredential extends Entity {
  provider: {
    type: IdentityProviderType;
    id: string;
    email: string;
  };
  userId: string;
  credential?: string;
}