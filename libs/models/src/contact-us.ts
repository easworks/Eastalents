export interface ContactUsRequest {
  name: string;
  email: string;
  phoneNumber: string | null;
  subject: string;
  body: string | null;
}
