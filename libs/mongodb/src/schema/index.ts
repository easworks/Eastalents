import { token_ref_schema } from './auth';
import { user_credentials_provider_schema, user_credentials_schema } from './identity-provider';
import { oauth_client_application_schema, oauth_code_schema } from './oauth';
import { permission_record_schema } from './permission-record';
import { pkce_challenge_schema } from './pkce';
import { user_schema } from './user';

export const entities = [
  user_schema,
  user_credentials_provider_schema,
  user_credentials_schema,
  pkce_challenge_schema,
  oauth_client_application_schema,
  oauth_code_schema,
  token_ref_schema,
  permission_record_schema
];