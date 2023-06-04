const ROLES = [
  'freelancer',
  'employer',
  'admin'
] as const;

export type Role = typeof ROLES[number];

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  token?: string;
  activate?: number;
  _id?: string;
}
