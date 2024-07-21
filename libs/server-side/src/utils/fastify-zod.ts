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
  output: this['input'] extends ZodTypeAny ? z.infer<this['input']> : unknown;
}

export type FastifyZodPluginAsync<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault,
> = FastifyPluginAsync<Options, Server, ZodTypeProvider>;
