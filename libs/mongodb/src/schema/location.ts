import { CSCLocation } from '@easworks/models/location';
import { EntitySchema } from '@mikro-orm/core';

export const csc_location_schema = new EntitySchema<CSCLocation>({
  name: 'CSCLocation',
  embeddable: true,
  properties: {
    country: { type: 'string' },
    state: { type: 'string' },
    city: { type: 'string' },
    timezone: { type: 'string' },
  }
});