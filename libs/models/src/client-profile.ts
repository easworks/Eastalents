import { BankAccount, BankAccountDescriptor, BusinessRegistrationDescriptor, BusinessTaxationDescriptor, BusinessTaxInfo } from './billing';
import { EasworksServiceType, RequiredExperience, WorkEnvironment } from './job-post';
import { Address, CSCLocation } from './location';
import { User } from './user';

export const CLIENT_PROFILE_MAX_DOMAINS = 4;
export const CLIENT_PROFILE_MAX_SOFTWARE = 6;

export const CLIENT_TYPE_OPTIONS = [
  'Enterprise',
  'Small & Medium Business',
  'Startup',
  'Professional Services',
  'Technology Services'
] as const;

export type ClientType = typeof CLIENT_TYPE_OPTIONS[number];

export const BUSINESS_ENTITY_TYPE_OPTIONS = [
  'Private Limited Company',
  'Public Limited Company',
  'Limited Liability Partnership (LLP)',
  'C-Corporation',
  'S-Corporation',
  'Partnership',
  'Sole Proprietorship (in some cases)',
  'One Person Company (OPC)',
  'Professional Corporation (PC)',
  'Limited Partnership (LP)',
  'Section 8 Company',
  'Proprietary Firm',
  'IT and Consulting Agencies',
  'Recruitment and Staffing Agencies',
  'Others (Franchise, Joint Venture, etc.)'
] as const;

export type BusinessEntityType = typeof BUSINESS_ENTITY_TYPE_OPTIONS[number];

export const EMPLOYEE_COUNT_OPTIONS = [
  '1 - 10',
  '11 - 50',
  '51 - 100',
  '101 - 500',
  '501+'
] as const;

export type EmployeeCount = typeof EMPLOYEE_COUNT_OPTIONS[number];

export const ANNUAL_REVENUE_RANGE_OPTIONS = [
  'upto 1 million USD',
  '1 - 10 million USD',
  '10 - 50 million USD',
  '50 - 100 million USD',
  'above 100 million USD'
] as const;

export type AnnualRevenueRange = typeof ANNUAL_REVENUE_RANGE_OPTIONS[number];

export interface ClientProfile {
  user: User;
  name: string;
  description: string;

  type: ClientType;
  businessEntityType: BusinessEntityType;
  employeeCount: EmployeeCount;
  annualRevenueRange: AnnualRevenueRange;
  industry: {
    name: string;
    group: string;
  };

  registration: {
    id: {
      value: string | null;
      descriptor: BusinessRegistrationDescriptor | null;
    },
    address: Address,
    tax: {
      value: BusinessTaxInfo;
      descriptor: BusinessTaxationDescriptor | null;
    };
  };

  bankAccount: {
    value: BankAccount;
    descriptor: BankAccountDescriptor | null;
  };

  billingAddress: Address | null;

  hiringPreferences: {
    serviceType: EasworksServiceType[];
    experience: RequiredExperience[];
    workEnvironment: WorkEnvironment[];
  };

  domains: string[];
  softwareProducts: string[];

  location: CSCLocation;

  contact: {
    primary: ClientProfileContact,
    secondary: ClientProfileContact | null;
  };
}

export interface ClientProfileContact {
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
}
