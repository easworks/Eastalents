import { FastifyPluginAsync, FastifyPluginOptions, FastifySchemaCompiler, FastifyTypeProvider, RawServerBase, RawServerDefault } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { z, ZodTypeAny, ZodUnknown } from 'zod';

const fastifyZod: FastifySchemaCompiler<ZodUnknown> = ({ schema }) => {
  return (data: unknown) => {
    const result = schema.safeParse(data);
    return result.success ? { value: result.data } : { error: result.error };
  };
};

const pluginImpl: FastifyPluginAsync = async server => {
  server.setValidatorCompiler(fastifyZod);
};

export const useZodValidation = fastifyPlugin(pluginImpl);

export interface ZodTypeProvider extends FastifyTypeProvider {
  validator: this['schema'] extends z.ZodTypeAny ? z.infer<this['schema']> : unknown;
  serializer: this['schema'] extends z.ZodTypeAny ? z.infer<this['schema']> : unknown;
}

export type FastifyZodPluginAsync<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault,
> = FastifyPluginAsync<Options, Server, ZodTypeProvider>;
