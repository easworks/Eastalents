import { InjectionToken } from '@angular/core';
import { ClientConfig } from './esm/client-config';

export const CLIENT_CONFIG = new InjectionToken<ClientConfig>('CLIENT_CONFIG');
