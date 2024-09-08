import { MikroORM } from '@mikro-orm/mongodb';

export type EAS_MikroORM = Awaited<ReturnType<typeof MikroORM['init']>>;
export type EAS_EntityManager = EAS_MikroORM['em'];
