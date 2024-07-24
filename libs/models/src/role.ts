export interface Role {
  id: string;
  permissions: string[];
  static: boolean;
  allowSignup: boolean;
}