import { user_credentials_provider_schema, user_credentials_schema } from './identity-provider';
import { user_schema } from './user';

export const entities = [
  user_schema,
  user_credentials_provider_schema,
  user_credentials_schema,
];