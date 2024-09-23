import { AnnualRevenueRange, ClientProfile, ClientSize, ClientType } from '@easworks/models/client-profile';
import { InitialProfileData, User } from '@easworks/models/user';
import { EntitySchema } from '@mikro-orm/mongodb';
import { user_schema } from './user';

export const client_profile_schema = new EntitySchema<ClientProfile>({
  collection: 'client-profiles',
  name: 'ClientProfile',
  properties: {
    user: { kind: '1:1', entity: () => user_schema, fieldName: '_id', primary: true, owner: true },
    name: { type: 'string' },
    description: { type: 'string' },
    type: { type: 'string' },
    size: { type: 'string' },
    industry: { type: 'json', object: true },
    domains: { type: 'string', array: true },
    softwareProducts: { type: 'string', array: true },
    location: { type: 'json', object: true },
    contact: { type: 'json', object: true },
    annualRevenueRange: { type: 'string' },
    hiringPreferences: { type: 'json', object: true }
  }
});


export function initialClientProfile(
  user: User,
  data: InitialProfileData
): ClientProfile {
  return {
    user,
    contact: {
      primary: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: null,
        website: null,
      },
      secondary: null
    },
    description: null as unknown as string,
    domains: data.domains,
    industry: {
      name: null as unknown as string,
      group: null as unknown as string
    },
    location: {
      city: null,
      country: null as unknown as string,
      state: null,
      timezone: null as unknown as string
    },
    name: null as unknown as string,
    size: null as unknown as ClientSize,
    type: null as unknown as ClientType,
    softwareProducts: data.softwareProducts,
    annualRevenueRange: null as unknown as AnnualRevenueRange,
    hiringPreferences: {
      experience: [],
      serviceType: [],
      workEnvironment: []
    }
  };
}