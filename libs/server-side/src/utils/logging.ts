import { FastifyBaseLogger, PinoLoggerOptions } from 'fastify/types/logger';

export function getLoggerOptions(devMode: boolean): PinoLoggerOptions {
  const baseOptions = {
  };
  const options: Partial<(FastifyBaseLogger & PinoLoggerOptions) | boolean> = devMode ?
    {
      ...baseOptions,
    } :
    {
      // ...gcpLogOptions(),
      ...baseOptions,
    };


  return options;
}