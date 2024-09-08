import { EmailVerificationCodeRef, PasswordResetCodeRef, TokenRef } from '@easworks/models/auth';
import { EntitySchema } from '@mikro-orm/mongodb';
import { id_prop, LuxonType } from '../utils';
import { user_schema } from './user';

export const token_ref_schema = new EntitySchema<TokenRef>({
  collection: 'tokens',
  name: 'TokenRef',
  properties: {
    _id: id_prop(),
    expiresAt: { type: LuxonType },
    user: { kind: 'm:1', entity: () => user_schema }
  }
});

export const email_verification_code_ref_schema = new EntitySchema<EmailVerificationCodeRef>({
  collection: 'otp-email-verification',
  name: 'EmailVerificationCodeRef',
  properties: {
    _id: id_prop(),
    expiresAt: { type: LuxonType },
    code: { type: 'string' },
    email: { type: 'string' },
    pkce: { type: 'string' }
  }
});

export const password_reset_code_ref_schema = new EntitySchema<PasswordResetCodeRef>({
  collection: 'otp-password-reset',
  name: 'PasswordResetCodeRef',
  properties: {
    _id: id_prop(),
    expiresAt: { type: LuxonType },
    code: { type: 'string' },
    email: { type: 'string' },
    pkce: { type: 'string' }
  }
});