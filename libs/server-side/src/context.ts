import type { JwtPayload } from 'jsonwebtoken';

export interface CloudUser {
  _id: string;
  roles: Set<string>;
  permissions: Set<string>;
  token: string;
  claims: JwtPayload;
};

export interface AuthenticatedCloudContext {
  readonly auth: CloudUser;
}

export interface UnauthenticatedCloudContext {
  readonly auth: null;
}

type CloudContextAuth = AuthenticatedCloudContext | UnauthenticatedCloudContext;


export type CloudContext = CloudContextAuth;
