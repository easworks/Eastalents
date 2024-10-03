export interface CSCLocation {
  country: string;
  state: string | null;
  city: string | null;
  timezone: string;
}

export interface Address {
  line1: string;
  line2: string | null;
  country: string;
  state: string | null;
  city: string | null;
  postalCode: string;
}