import type { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from 'models/user';

export type CloudUser = JwtPayload & TokenPayload & {
  token: string;
  permissions: Set<string>;
};

export interface AuthenticatedCloudContext {
  readonly auth: CloudUser;
}

export interface UnauthenticatedCloudContext {
  readonly auth: null;
}

type CloudContextAuth = AuthenticatedCloudContext | UnauthenticatedCloudContext;


export type CloudContext = CloudContextAuth;
