// TODO: get better typings
// by using unions / discriminated unions
export interface ApiResponse<T = unknown> {
  error?: boolean;
  status?: boolean;
  message?: string;
  result?: T;
  [key: string]: unknown;
}
