// TODO: get better typings
// by using unions / discriminated unions
export interface ApiResponse<T = any> {
  error?: boolean;
  status?: boolean;
  message?: string;
  result?: T;
  [key: string]: any;
}
