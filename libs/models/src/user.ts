export interface User {
  _id: string;
  role: string;
  verified: boolean;
  active: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserWithToken extends User {
  token: string;
}
