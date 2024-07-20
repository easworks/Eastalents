import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const pluginImpl: FastifyPluginAsync = async server => {

};

export const handlers = fastifyPlugin(pluginImpl);