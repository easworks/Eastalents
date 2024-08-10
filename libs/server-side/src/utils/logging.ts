import { PinoLoggerOptions } from 'fastify/types/logger';
import { EnvironmentID } from 'models/environment';

export function getLoggerOptions(envId: EnvironmentID): PinoLoggerOptions {
  const baseOptions = {
  };

  switch (envId) {
    case 'local': return {
      ...baseOptions
    };
    case 'development': return {
      ...baseOptions
    };
    case 'production': return {
      // ...gcpLogOptions(),
      ...baseOptions
    };
  }
}