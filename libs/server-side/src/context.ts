import { EAS_MikroORM } from '@easworks/mongodb/types';
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
  em: EAS_MikroORM['em'];
}

declare module 'fastify' {
  export interface FastifyRequest {
    ctx: CloudContext;
  }

  export interface FastifyInstance {
    orm: EAS_MikroORM;
  }
}