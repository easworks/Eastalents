export interface StripeTaxIDDescriptor {
  country: string;
  externalType: string;
  description: string;
  placeholder: string;
}

export interface CountryBusinessDescriptor {
  enumeration: string;
  company: string | null;
  tax: string | null;
  gst: string | null;
}

export interface CountryBankDescriptor {
  account: string | null;
  code: string | null;
}

export interface CountryBillingDescriptor {
  iso2: string;
  bank: CountryBankDescriptor;
  business: CountryBusinessDescriptor[];
}