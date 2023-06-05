const ROLES = [
  'freelancer',
  'employer',
  'admin'
] as const;

export type Role = typeof ROLES[number];

export interface User {
  _id: string;
  role: Role;
  verified: boolean;
  active: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserWithToken extends User {
  token: string;
}
