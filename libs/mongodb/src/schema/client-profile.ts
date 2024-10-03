import { AnnualRevenueRange, BusinessEntityType, ClientProfile, ClientType, EmployeeCount } from '@easworks/models/client-profile';
import { Address } from '@easworks/models/location';
import { InitialProfileData, User } from '@easworks/models/user';
import { EntitySchema } from '@mikro-orm/mongodb';
import { user_schema } from './user';

export const client_profile_schema = new EntitySchema<ClientProfile>({
  collection: 'client-profiles',
  name: 'ClientProfile',
  properties: {
    user: { kind: '1:1', entity: () => user_schema, fieldName: '_id', primary: true, owner: true, serializedName: 'user' },
    name: { type: 'string' },
    description: { type: 'string' },
    type: { type: 'string' },
    businessEntityType: { type: 'string' },
    employeeCount: { type: 'string' },
    industry: { type: 'json', object: true },
    registration: { type: 'json', object: true },
    bankAccount: { type: 'json', object: true },
    billingAddress: { type: 'json', object: true },
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
    name: null as unknown as string,
    description: null as unknown as string,

    type: null as unknown as ClientType,
    employeeCount: null as unknown as EmployeeCount,
    businessEntityType: null as unknown as BusinessEntityType,
    annualRevenueRange: null as unknown as AnnualRevenueRange,

    industry: {
      name: null as unknown as string,
      group: null as unknown as string
    },

    registration: {
      id: {
        value: null,
        descriptor: null,
      },
      address: null as unknown as Address,
      tax: {
        value: {
          taxId: null,
          gstId: null
        },
        descriptor: null
      }
    },

    bankAccount: {
      value: {
        account: null as unknown as string,
        code: null
      },
      descriptor: null
    },

    billingAddress: null,

    hiringPreferences: {
      experience: [],
      serviceType: [],
      workEnvironment: []
    },

    domains: data.domains,
    softwareProducts: data.softwareProducts,

    location: {
      city: null,
      country: null as unknown as string,
      state: null,
      timezone: null as unknown as string
    },

    contact: {
      primary: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: null,
        website: null,
      },
      secondary: null
    },
  };
}