import { EmployerProfile } from '@easworks/models/employer-profile';
import { EntitySchema } from '@mikro-orm/mongodb';
import { csc_location_schema } from './location';
import { user_schema } from './user';

export const employer_profile_industry_schema = new EntitySchema<EmployerProfile['industry']>({
  name: 'EmployerProfile.industry',
  embeddable: true,
  properties: {
    name: { type: 'string' },
    group: { type: 'string' }
  }
});

export const employer_profile_contact_schema = new EntitySchema<EmployerProfile['contact']>({
  name: 'EmployerProfile.contact',
  embeddable: true,
  properties: {
    email: { type: 'string' },
    phone: { type: 'string' },
    website: { type: 'string' },
  }
});

export const employer_profile_schema = new EntitySchema<EmployerProfile>({
  collection: 'employer-profiles',
  name: 'EmployerProfile',
  properties: {
    user: { kind: '1:1', entity: () => user_schema, fieldName: '_id', primary: true, owner: true },
    orgName: { type: 'string' },
    description: { type: 'string' },
    orgType: { type: 'string' },
    orgSize: { type: 'string' },
    industry: { kind: 'embedded', entity: () => employer_profile_industry_schema },
    domains: { type: 'array' },
    softwareProducts: { type: 'array' },
    location: { kind: 'embedded', entity: () => csc_location_schema },
    contact: { kind: 'embedded', entity: () => employer_profile_contact_schema }
  }
});