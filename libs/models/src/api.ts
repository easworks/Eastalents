// TODO: get better typings
// by using unions / discriminated unions
export interface ApiResponse<T> {
  error?: boolean;
  status?: boolean;
  message?: string;
  result?: T;
}
