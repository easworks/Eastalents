export interface ContactUsRequest {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string | null;
}

export class PhoneNumber {
  public static split(phone: string) {
    const [code, number] = phone.split('-', 2);
    return { code, number };
  }

  public static join(phone: ReturnType<typeof this.split>) {
    return `${phone.code}-${phone.number}`;
  }
}