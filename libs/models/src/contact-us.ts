export interface ContactUsRequest {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string | null;
}
