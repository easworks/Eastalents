import { email_verification_code_ref_schema, password_reset_code_ref_schema, token_ref_schema } from './auth';
import { user_credential_provider_schema, user_credential_schema } from './identity-provider';
import { keyval_schema } from './keyval';
import { oauth_client_application_schema, oauth_code_schema } from './oauth';
import { permission_record_schema } from './permission-record';
import { pkce_challenge_schema } from './pkce';
import { user_schema } from './user';

export const entities = [
  user_schema,
  user_credential_provider_schema,
  user_credential_schema,
  pkce_challenge_schema,
  oauth_client_application_schema,
  oauth_code_schema,
  token_ref_schema,
  permission_record_schema,
  email_verification_code_ref_schema,
  password_reset_code_ref_schema,
  keyval_schema
];