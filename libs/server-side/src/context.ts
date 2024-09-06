import type { JwtPayload } from 'jsonwebtoken';

export interface CloudUser {
  _id: string;
  roles: Set<string>;
  permissions: Set<string>;
  token: string;
  claims: JwtPayload;
};

export interface CloudContext {
  auth: CloudUser | null;
}


declare module 'fastify' {
  export interface FastifyRequest {
    ctx: CloudContext;
  }
}