export interface BankAccount {
  account: string;
  code: string | null;
}

export interface BusinessTaxInfo {
  taxId: string | null;
  gstId: string | null;
}



export interface StripeTaxIDDescriptor {
  country: string;
  externalType: string;
  description: string;
  placeholder: string;
}

export type BusinessRegistrationDescriptor = string;

export type BusinessTaxationDescriptor = {
  enumeration: string;
  taxId: string | null;
  gstId: string | null;
};

export interface BankAccountDescriptor {
  account: string | null;
  code: string | null;
}

export interface CountryBillingDescriptor {
  iso2: string;
  bank: BankAccountDescriptor;
  business: {
    id: BusinessRegistrationDescriptor[];
    tax: BusinessTaxationDescriptor[];
  };

  // individual: {
  //   id: BusinessRegistrationDescriptor[]
  //   tax: BusinessTaxationDescriptor[]
  // };
}

export const PAYMENT_METHOD_OPTIONS = [
  'Bank Transfer',
  'Credit Card',
  'PayPal'
] as const;

export type PaymentMethod = typeof PAYMENT_METHOD_OPTIONS[number];

export const PAYMENT_TERM_OPTIONS = [
  'Net 30',
  'Net 60',
  'Net 90'
] as const;

export type PaymentTerm = typeof PAYMENT_TERM_OPTIONS[number];

export const ACCEPTED_CURRENCY_OPTIONS = [
  'USD',
  'EUR',
  'INR',
  'GBP',
  'AUD'
] as const;

export type AcceptedCurrency = typeof ACCEPTED_CURRENCY_OPTIONS[number];
