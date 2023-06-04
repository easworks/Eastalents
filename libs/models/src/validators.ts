export const pattern = {
  email: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
  password: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
} as const;
